"""
Reviews.py — Cào bình luận (reviews) cho từng cuốn sách từ Tiki API theo từng thể loại
Dự án: NovelIQ

Yêu cầu kỹ thuật:
1. Chuẩn hóa đúng 6 trường dữ liệu cho mỗi review:
   - review_id (int): mã định danh đánh giá
   - product_id (int): mã sách
   - title (str): tiêu đề đánh giá
   - content (str): nội dung đánh giá
   - rating (int): số sao đánh giá (1-5)
   - reviewer (str): tên người đánh giá (hoặc "Ẩn danh")
2. Dữ liệu đầu ra được lưu trong thư mục Data/Review/
   - Mỗi thể loại được lưu riêng biệt trong 1 file JSON:
     Ví dụ: Data/Review/reviews_category_444.json
   - Định dạng: JSON Array [...] sẵn sàng import vào MongoDB.
3. Cơ chế Checkpoint & Atomic Write an toàn:
   - File: Data/Review/checkpoint.json lưu danh sách processed_book_ids và trạng thái từng category
   - Khởi động lại: tự động nạp reviews cũ và danh sách ID đã hoàn thành để bỏ qua (skip), không cào lại
   - Ghi an toàn (Atomic write qua .tmp và os.replace) tránh hỏng file khi gặp sự cố hoặc Ctrl+C.
"""

import os
import re
import json
import time
import glob
import signal
import sys
from datetime import datetime, timezone
from curl_cffi import requests

# ─────────────────────────────────────────────
# CẤU HÌNH HỆ THỐNG
# ─────────────────────────────────────────────
PRODUCTS_DIR     = "Data/products"
REVIEW_DIR       = os.path.join("Data", "Review")
CHECKPOINT_FILE  = os.path.join(REVIEW_DIR, "checkpoint.json")

REVIEWS_API      = "https://tiki.vn/api/v2/reviews"
LIMIT_PER_PAGE   = 20         # Số review mỗi trang (tối đa 20 theo API Tiki)
MAX_PAGES        = 10         # Giới hạn số trang mỗi sách (None = cào hết)
DELAY_BETWEEN    = 0.1       # Thời gian nghỉ giữa các trang (giây)
DELAY_BOOK       = 0.2        # Thời gian nghỉ giữa các cuốn sách (giây)
SAVE_INTERVAL    = 5          # Lưu an toàn sau mỗi N cuốn sách hoặc ngay khi có review mới
TEST_MODE        = False      # True = chỉ chạy thử 1 thể loại và 2 sách đầu tiên

HEADERS = {
    "Accept": "application/json",
    "Referer": "https://tiki.vn/",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
}

# Đảm bảo thư mục lưu trữ Data/Review luôn tồn tại
os.makedirs(REVIEW_DIR, exist_ok=True)


# ─────────────────────────────────────────────
# GHI FILE AN TOÀN (ATOMIC WRITE)
# ─────────────────────────────────────────────
def atomic_save_json(filepath: str, data) -> bool:
    """Ghi dữ liệu ra file tạm (.tmp) rồi đổi tên nguyên tử để chống hỏng file."""
    tmp_path = filepath + ".tmp"
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(tmp_path, filepath)
        return True
    except Exception as e:
        print(f"Lỗi khi ghi file an toàn {filepath}: {e}")
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        return False


def save_checkpoint(processed_book_ids: set[int], completed_categories: set[str], stats: dict):
    """Lưu tiến trình checkpoint vào Data/Review/checkpoint.json."""
    checkpoint_data = {
        "processed_book_ids": sorted(list(processed_book_ids)),
        "completed_categories": sorted(list(completed_categories)),
        "last_updated_at": datetime.now(timezone.utc).isoformat(),
        "total_processed_books": len(processed_book_ids),
        "stats": stats,
    }
    atomic_save_json(CHECKPOINT_FILE, checkpoint_data)


# ─────────────────────────────────────────────
# NẠP CHECKPOINT & DỮ LIỆU CŨ CỦA THỂ LOẠI
# ─────────────────────────────────────────────
def load_checkpoint() -> tuple[set[int], set[str], dict]:
    """
    Nạp danh sách processed_book_ids và completed_categories từ checkpoint.json.
    Trả về: (processed_book_ids, completed_categories, stats)
    """
    processed_book_ids: set[int] = set()
    completed_categories: set[str] = set()
    stats: dict = {}

    if os.path.exists(CHECKPOINT_FILE):
        try:
            with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
                ckpt = json.load(f)
                if isinstance(ckpt, dict):
                    processed_book_ids = set(ckpt.get("processed_book_ids", []))
                    completed_categories = set(ckpt.get("completed_categories", []))
                    stats = ckpt.get("stats", {})
                    print(f"Đã nạp checkpoint: {len(processed_book_ids):,} sách đã xử lý, {len(completed_categories)} thể loại đã xong.")
        except Exception as e:
            print(f"Không đọc được checkpoint ({e}). Khởi tạo checkpoint mới.")

    return processed_book_ids, completed_categories, stats


def load_category_reviews(cat_id: str) -> tuple[list[dict], set[int]]:
    """
    Nạp các review đã cào trước đó của thể loại cat_id nếu đã có file reviews_category_<cat_id>.json.
    Trả về: (reviews_list, existing_review_ids_set)
    """
    cat_file = os.path.join(REVIEW_DIR, f"reviews_category_{cat_id}.json")
    reviews: list[dict] = []
    seen_review_ids: set[int] = set()

    if os.path.exists(cat_file):
        try:
            with open(cat_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    reviews = data
                    for rv in reviews:
                        rid = rv.get("review_id")
                        if rid is not None:
                            seen_review_ids.add(rid)
                    print(f"Đã có sẵn {len(reviews):,} reviews trong {os.path.basename(cat_file)}")
        except Exception as e:
            print(f"Lỗi khi đọc {cat_file} ({e}), bắt đầu danh sách mới.")

    return reviews, seen_review_ids


# ─────────────────────────────────────────────
# CÀO REVIEWS CỦA 1 CUỐN SÁCH TỪ TIKI API
# ─────────────────────────────────────────────
def fetch_reviews_for_book(session, product_id: int) -> tuple[bool, list[dict]]:
    """
    Gọi API reviews của Tiki và chuẩn hóa CHỈ LẤY ĐÚNG 6 TRƯỜNG:
    1. review_id (int)
    2. product_id (int)
    3. title (str)
    4. content (str)
    5. rating (int)
    6. reviewer (str)

    Trả về:
    - (True, book_reviews): Nếu cào thành công tất cả các trang (HTTP status 200).
    - (False, []): Nếu gặp bất kỳ lỗi status nào (!= 200) hoặc lỗi kết nối/JSON.
    """
    book_reviews = []
    page = 1

    while True:
        params = {
            "product_id": str(product_id),
            "page": str(page),
            "limit": str(LIMIT_PER_PAGE),
            "include": "comments,contribute_info",
            "sort": "created_at|desc",
        }

        try:
            r = session.get(REVIEWS_API, headers=HEADERS, params=params, timeout=15)
        except Exception as e:
            print(f"Lỗi kết nối khi cào trang {page}: {e}")
            return False, []

        # Chỉ chấp nhận HTTP status 200
        if r.status_code != 200:
            print(f"Lỗi HTTP status {r.status_code} ở trang {page} (không phải 200 OK)")
            return False, []

        try:
            data = r.json()
        except Exception as e:
            print(f"Không giải mã được JSON trang {page}: {e}")
            return False, []

        if not isinstance(data, dict):
            print(f"Dữ liệu trả về không hợp lệ (không phải dict) ở trang {page}")
            return False, []

        reviews_raw = data.get("data", [])
        if isinstance(reviews_raw, list):
            for rv in reviews_raw:
                if not isinstance(rv, dict):
                    continue
                # Xử lý tên người đánh giá
                reviewer_obj = rv.get("created_by")
                reviewer_name = "Ẩn danh"
                if isinstance(reviewer_obj, dict):
                    reviewer_name = reviewer_obj.get("name") or "Ẩn danh"

                review_id_val = rv.get("id")
                rating_val = rv.get("rating", 0)

                # Tạo dictionary đúng 6 trường quy chuẩn
                review_doc = {
                    "review_id": int(review_id_val) if review_id_val is not None else 0,
                    "product_id": int(product_id),
                    "title": str(rv.get("title") or "").strip(),
                    "content": str(rv.get("content") or "").strip(),
                    "rating": int(rating_val) if rating_val is not None else 0,
                    "reviewer": str(reviewer_name).strip() if reviewer_name else "Ẩn danh",
                }
                book_reviews.append(review_doc)

        # Phân trang
        paging = data.get("paging", {})
        if not isinstance(paging, dict):
            paging = {}
        current_page = paging.get("current_page", page)
        last_page = paging.get("last_page", 1)
        total = paging.get("total", 0)

        if page == 1 and total > 0:
            print(f"Tổng {total} reviews | {last_page} trang")

        if current_page >= last_page or not reviews_raw:
            break
        if MAX_PAGES and page >= MAX_PAGES:
            print(f"Giới hạn MAX_PAGES={MAX_PAGES} (dừng ở trang {page}/{last_page})")
            break

        page += 1
        time.sleep(DELAY_BETWEEN)

    return True, book_reviews


# ─────────────────────────────────────────────
# TIẾN TRÌNH CHÍNH (MAIN)
# ─────────────────────────────────────────────
def main():
    print("=" * 70)
    print("REVIEWS.PY — CÀO REVIEWS THEO THỂ LOẠI (TIKI API)")
    print(f"Thư mục lưu kết quả : {REVIEW_DIR}/")
    print(f"File checkpoint      : {CHECKPOINT_FILE}")
    if TEST_MODE:
        print("CHẾ ĐỘ THỬ NGHIỆM (TEST MODE): Chỉ chạy 1 category, 2 sách")
    print("=" * 70)

    # 1. Nạp checkpoint
    processed_book_ids, completed_categories, stats = load_checkpoint()

    # 2. Lấy danh sách file category từ Data/products/
    category_files = sorted(glob.glob(os.path.join(PRODUCTS_DIR, "category_*.json")))
    if not category_files:
        print(f"Không tìm thấy file thể loại nào trong {PRODUCTS_DIR}/")
        return

    print(f"Tìm thấy {len(category_files)} file thể loại trong {PRODUCTS_DIR}/")
    if TEST_MODE:
        category_files = category_files[:1]
        print(f"  → Chế độ TEST: chỉ chạy file {os.path.basename(category_files[0])}")

    # Đăng ký xử lý ngắt an toàn (Ctrl+C hoặc SIGTERM)
    current_cat_file = [None]
    current_cat_reviews = [[]]

    def handle_shutdown(signum, frame):
        print("\n\n Nhận tín hiệu dừng! Đang lưu tiến trình hiện tại...")
        if current_cat_file[0] and current_cat_reviews[0]:
            atomic_save_json(current_cat_file[0], current_cat_reviews[0])
            print(f"Đã lưu {len(current_cat_reviews[0]):,} reviews vào {current_cat_file[0]}")
        save_checkpoint(processed_book_ids, completed_categories, stats)
        print("Đã cập nhật checkpoint an toàn. Tạm dừng chương trình.")
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)

    session = requests.Session(impersonate="chrome")

    total_categories = len(category_files)
    total_reviews_all = 0

    try:
        for cat_idx, fpath in enumerate(category_files, 1):
            fname = os.path.basename(fpath)
            # Trích xuất category_id từ tên file (ví dụ: category_444.json -> 444)
            match = re.search(r"category_(\d+)\.json", fname)
            cat_id = match.group(1) if match else fname.replace(".json", "")

            out_cat_file = os.path.join(REVIEW_DIR, f"reviews_category_{cat_id}.json")
            current_cat_file[0] = out_cat_file

            print(f"\n{'─'*70}")
            print(f"[{cat_idx}/{total_categories}] THỂ LOẠI ID: {cat_id} ({fname})")
            print(f"File lưu: {out_cat_file}")

            # Đọc danh sách sách trong category
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    books = json.load(f)
            except Exception as e:
                print(f"Lỗi đọc file {fpath}: {e}")
                continue

            if not isinstance(books, list):
                print(f"Cấu trúc file {fpath} không phải danh sách, bỏ qua.")
                continue

            if TEST_MODE:
                books = books[:2]
                print(f"Chế độ TEST: chỉ cào {len(books)} sách đầu tiên của thể loại này.")

            # Nạp reviews đã cào trước đó của thể loại này (nếu có)
            cat_reviews, seen_review_ids = load_category_reviews(cat_id)
            current_cat_reviews[0] = cat_reviews

            cat_total_books = len(books)
            books_crawled_in_cat = 0
            new_reviews_in_cat = 0
            unsaved_count = 0

            for b_idx, book in enumerate(books, 1):
                bid = book.get("_id")
                if bid is None:
                    continue
                bid = int(bid)
                bname = book.get("name", "Không rõ tên")[:50]

                # Bỏ qua nếu sách đã được cào trước đó
                if bid in processed_book_ids:
                    if b_idx % 200 == 0 or b_idx == cat_total_books:
                        print(f"    [{b_idx}/{cat_total_books}] ⏭  Đã xử lý trước đó: ID {bid}")
                    continue

                print(f"[{b_idx}/{cat_total_books}] Cào sách: {bname} (ID: {bid})")
                try:
                    success, book_rvs = fetch_reviews_for_book(session, bid)
                except Exception as e:
                    print(f"Lỗi bất thường khi lấy reviews sách {bid}: {e}")
                    success = False
                    book_rvs = []

                # KHÔNG ghi vào checkpoint nếu gặp bất kỳ mã lỗi status nào (!= 200) hoặc lỗi kết nối
                if not success:
                    print(f"[BỎ QUA CHECKPOINT] Sách ID {bid} gặp lỗi (status != 200). Không ghi checkpoint để xử lý lại sau.")
                    time.sleep(DELAY_BOOK)
                    continue

                # Chỉ khi status == 200 thành công mới tiến hành ghi nhận dữ liệu và checkpoint
                added_for_this_book = 0
                if book_rvs:
                    for rv in book_rvs:
                        rid = rv["review_id"]
                        if rid not in seen_review_ids:
                            seen_review_ids.add(rid)
                            cat_reviews.append(rv)
                            added_for_this_book += 1
                            new_reviews_in_cat += 1
                    print(f"Thu thập {added_for_this_book} reviews mới (Tổng trong category: {len(cat_reviews):,})")
                else:
                    print(f"Sách chưa có review nào (HTTP 200 OK)")

                # Đánh dấu sách đã xử lý thành công (status 200) vào checkpoint
                processed_book_ids.add(bid)
                books_crawled_in_cat += 1
                unsaved_count += 1

                # Lưu định kỳ khi có review mới hoặc qua SAVE_INTERVAL cuốn sách
                if added_for_this_book > 0 or unsaved_count >= SAVE_INTERVAL:
                    atomic_save_json(out_cat_file, cat_reviews)
                    stats[cat_id] = len(cat_reviews)
                    save_checkpoint(processed_book_ids, completed_categories, stats)
                    unsaved_count = 0

                time.sleep(DELAY_BOOK)

            # Lưu dữ liệu reviews của thể loại này
            atomic_save_json(out_cat_file, cat_reviews)
            stats[cat_id] = len(cat_reviews)

            # Chỉ ghi nhận hoàn thành thể loại vào completed_categories nếu 100% sách đều thành công (status 200)
            valid_book_ids = [int(b["_id"]) for b in books if b.get("_id") is not None]
            all_cat_books_done = len(valid_book_ids) > 0 and all(bid in processed_book_ids for bid in valid_book_ids)

            if all_cat_books_done:
                completed_categories.add(cat_id)
                print(f"Hoàn thành 100% thể loại {cat_id}: Lưu tổng cộng {len(cat_reviews):,} reviews vào {out_cat_file}")
            else:
                remaining_failed = sum(1 for bid in valid_book_ids if bid not in processed_book_ids)
                print(f"Thể loại {cat_id} còn {remaining_failed}/{len(valid_book_ids)} sách chưa thành công (status != 200).")
                print(f"Chưa ghi nhận hoàn tất thể loại {cat_id} vào checkpoint để có thể cào lại.")

            save_checkpoint(processed_book_ids, completed_categories, stats)
            total_reviews_all += len(cat_reviews)

    except KeyboardInterrupt:
        print("\n\n Người dùng nhấn Ctrl+C để dừng tiến trình!")
    except Exception as e:
        print(f"\n Lỗi phát sinh ngoài dự kiến: {e}")
    finally:
        session.close()
        # Lưu file đang cào dở và checkpoint lần cuối
        if current_cat_file[0] and current_cat_reviews[0]:
            atomic_save_json(current_cat_file[0], current_cat_reviews[0])
        save_checkpoint(processed_book_ids, completed_categories, stats)
        print(f"\n Đã lưu an toàn toàn bộ tiến trình vào {REVIEW_DIR}/")

    # Báo cáo tổng kết
    print("\n" + "=" * 70)
    print("BÁO CÁO TỔNG KẾT:")
    print(f"    - Thư mục lưu        : {REVIEW_DIR}/")
    print(f"    - Thể loại đã duyệt  : {len(completed_categories)}/{total_categories}")
    print(f"    - Tổng sách đã xử lý : {len(processed_book_ids):,}")
    print(f"    - Thống kê reviews theo từng thể loại:")
    for cid, cnt in stats.items():
        print(f"        • reviews_category_{cid}.json: {cnt:,} reviews")
    print("=" * 70)


if __name__ == "__main__":
    main()
