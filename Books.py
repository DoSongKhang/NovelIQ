"""
=============================================================
    LẤY TẤT CẢ CÁC SẢN PHẨM SÁCH TỪ FILE CATEGORIES.CSV
    (PHIÊN BẢN XUẤT JSON - TIỆN IMPORT VÀO MONGODB)
=============================================================
QUY TRÌNH:
1. Đọc danh sách tất cả các category từ file "Data/categories.csv"
2. Duyệt qua từng category, dùng ID và URL Key để gọi API Tiki (dùng curl_cffi giả lập Chrome).
3. Retry HTTP tự động đối với những lỗi tạm thời.
4. Bóc tách thông tin sản phẩm và lọc trùng lặp (duplicate).
5. Lưu kết quả của mỗi category thành một file JSON riêng tại "Data/products/category_<ID>.json".

Mỗi file JSON là một MẢNG các document, import trực tiếp vào MongoDB bằng:
    mongoimport --db books_app --collection books --jsonArray --file Data/products/category_<ID>.json
"""

import os
import json
import time
import random
from datetime import datetime, timezone

import pandas as pd
from curl_cffi import requests

# ============================================================
# 1. CONFIG FILE VÀ THƯ MỤC LƯU TRỮ
# ============================================================

CATEGORY_CSV = "Data/categories.csv"
OUTPUT_DIR = "Data/products"

# ============================================================
# 2. TIKI API & CẤU HÌNH RETRY
# ============================================================

API_URL = "https://tiki.vn/api/personalish/v1/blocks/listings"

FIXED_PARAMS = {
    "limit": 40,
    "include": "advertisement",
    "aggregations": 2,
    "version": "home-persionalized",
    "trackity_id": "065c7957-441c-ad9d-524e-4f326a13bc37",
}

RETRY_STATUS = {429, 500, 502, 503, 504}

# ============================================================
# 3. TẠO SESSION (GIẢ LẬP CHROME BẰNG CURL_CFFI)
# ============================================================

session = requests.Session(impersonate="chrome")
session.headers.update(
    {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://tiki.vn/",
    }
)


# ============================================================
# 4. GỌI API MỘT PAGE (CÓ RETRY)
# ============================================================

def get_page(category_id, url_key, page, max_retries=5):
    """Gọi Tiki Listing API cho một page và tự động retry khi gặp lỗi tạm thời."""
    params = FIXED_PARAMS.copy()
    params.update({
        "category": category_id,
        "page": page,
        "urlKey": url_key,
    })

    for attempt in range(1, max_retries + 1):
        print(f"\n[REQUEST] page={page} (attempt {attempt}/{max_retries})")
        try:
            response = session.get(API_URL, params=params, timeout=20)
            print(f"[STATUS] {response.status_code}")

            if response.status_code in RETRY_STATUS:
                wait = 2 ** attempt
                print(f"[RETRY] Gặp mã {response.status_code}, đợi {wait}s...")
                time.sleep(wait)
                continue

            response.raise_for_status()

            if not response.text.strip():
                raise ValueError(f"Response rỗng ở page={page}")

            result = response.json()
            data = result.get("data", [])
            print(f"[DATA] {len(data)} items")
            return data

        except (requests.RequestsError, ValueError) as e:
            if attempt == max_retries:
                raise
            wait = 2 ** attempt
            print(f"[ERROR] page={page}: {e} -> đợi {wait}s rồi thử lại...")
            time.sleep(wait)

    raise RuntimeError(f"Hết {max_retries} lần thử cho page={page}")


# ============================================================
# 5. BÓC TÁCH PRODUCT -> DOCUMENT JSON (MONGODB-FRIENDLY)
# ============================================================

def extract_product(product, category_id, category_name):
    """
    Chỉ lấy những field cần thiết, tổ chức thành document lồng nhau:
      - _id        : dùng luôn ID sản phẩm Tiki (tránh trùng khi import lại)
      - rating     : gom rating_average + review_count
      - price      : gom giá gốc, giá bán, % giảm
      - category   : thông tin danh mục
    """
    product_id = product.get("id")
    url_key = product.get("url_key")
    product_url = f"https://tiki.vn/{url_key}.html" if url_key else None

    quantity_sold = product.get("quantity_sold")
    if isinstance(quantity_sold, dict):
        quantity_sold = quantity_sold.get("value")

    original_price = product.get("original_price")
    price = product.get("price")

    discount_rate = product.get("discount_rate")
    if discount_rate is None and original_price and price is not None and original_price > 0:
        discount_rate = max(0.0, round((original_price - price) / original_price * 100, 2))

    return {
        "_id": product_id,
        "name": product.get("name"),
        "url_key": url_key,
        "url": product_url,
        "rating": {
            "average": product.get("rating_average"),
            "count": product.get("review_count"),
        },
        "price": {
            "original": original_price,
            "current": price,
            "discount_rate": discount_rate,
            "currency": "VND",
        },
        "quantity_sold": quantity_sold,
        "category": {
            "id": category_id,
            "name": category_name,
        },
        "source": "tiki",
        "crawled_at": datetime.now(timezone.utc).isoformat(),
    }


# ============================================================
# 6. CRAWL TOÀN BỘ SẢN PHẨM TRONG 1 CATEGORY
# ============================================================

def crawl_category(category_id, category_name, url_key):
    """Crawl từ page 1 cho đến khi hết dữ liệu."""
    all_products = []
    seen_ids = set()
    page = 1

    print(f"\n{'='*60}\nSTART CRAWL\nCategory ID : {category_id}\nURL Key     : {url_key}\n{'='*60}")

    while True:
        empty_retry = 0
        while True:
            try:
                data = get_page(category_id, url_key, page)
                if data:
                    print(f"[OK] page={page} -> {len(data)} products")
                    break

                empty_retry += 1
                print(f"[EMPTY] page={page} -> data=[] (retry {empty_retry}/3)")
                # Nếu đã qua page 1 hoặc retry đủ 3 lần thì xác nhận hết trang
                if page > 1 or empty_retry >= 3:
                    print(f"[STOP] page={page} -> xác nhận hết dữ liệu.")
                    return all_products

                time.sleep(2 * empty_retry)

            except Exception as e:
                print(f"[STOP] Bỏ qua danh mục {category_id} tại page={page} do lỗi: {e}")
                return all_products

        new_count = 0
        duplicate_count = 0

        for product in data:
            product_id = product.get("id")
            if product_id is None or product_id in seen_ids:
                if product_id in seen_ids:
                    duplicate_count += 1
                continue

            seen_ids.add(product_id)
            all_products.append(extract_product(product, category_id, category_name))
            new_count += 1

        print(f"[EXTRACT] page={page} new={new_count} duplicate={duplicate_count}")
        print(f"[TOTAL] {len(all_products)} products")

        # Điều kiện chống lặp vô tận: Nếu page trả về toàn sản phẩm trùng (chỉ còn quảng cáo)
        if new_count == 0:
            print(f"[STOP] page={page} -> Không còn sản phẩm mới. Hoàn thành danh mục {category_id}.")
            return all_products

        page += 1
        time.sleep(random.uniform(1.5, 3.0))


# ============================================================
# 7. LƯU JSON CHUẨN MONGODB & APP
# ============================================================

def save_json(products, category_id, category_name):
    """Lưu danh sách sản phẩm thành file JSON chuẩn (hỗ trợ MongoDB & App)."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_file = os.path.join(OUTPUT_DIR, f"category_{category_id}.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}\nDONE: {category_name}\nProducts : {len(products)}\nOutput   : {output_file}\n{'='*60}")
    return output_file


# ============================================================
# 8. MAIN PIPELINE (LINH HOẠT CSV / JSON & AN TOÀN SESSION)
# ============================================================

def main():
    print(f"{'='*60}\nBẮT ĐẦU PIPELINE THU THẬP DỮ LIỆU SÁCH\n{'='*60}")

    # Đọc danh mục: tự động nhận diện JSON hoặc CSV
    df_categories = None
    category_json = "Data/categories.json"

    if os.path.exists(category_json):
        print(f"[INPUT] Đọc danh mục từ JSON: {category_json}")
        with open(category_json, "r", encoding="utf-8") as f:
            df_categories = pd.DataFrame(json.load(f))
    elif os.path.exists(CATEGORY_CSV):
        print(f"[INPUT] Đọc danh mục từ CSV: {CATEGORY_CSV}")
        df_categories = pd.read_csv(CATEGORY_CSV)
    else:
        print(f"[LỖI] Không tìm thấy file danh mục '{category_json}' hoặc '{CATEGORY_CSV}'.")
        return

    if df_categories.empty:
        raise ValueError("Danh sách danh mục không có dữ liệu!")

    total = len(df_categories)
    print(f"Tìm thấy {total} danh mục cần xử lý.\n")

    success_categories = 0
    total_books_collected = 0

    try:
        for idx, row in df_categories.iterrows():
            category_id = int(row["Category_ID"])
            category_name = row["Category_Name"]
            category_url = row["Category_URL"]

            # Lọc url_key an toàn (loại bỏ dấu / thừa ở đuôi nếu có)
            try:
                url_key = category_url.strip("/").split("/")[-2]
            except Exception:
                url_key = ""

            print(f"\n[{idx+1}/{total}] Đang xử lý: {category_name} (ID: {category_id} | Key: {url_key})")
            print("-" * 60)

            try:
                products = crawl_category(category_id, category_name, url_key)
                if products:
                    save_json(products, category_id, category_name)
                    success_categories += 1
                    total_books_collected += len(products)
                else:
                    print(f"[CẢNH BÁO] Không cào được sản phẩm nào cho danh mục {category_name}")
            except Exception as e:
                print(f"[LỖI] Danh mục {category_id} ({category_name}) thất bại: {e}")

            time.sleep(random.uniform(2.0, 4.0))

    finally:
        # Đóng session an toàn để giải phóng tài nguyên C/libcurl, chống lỗi khi kết thúc script
        try:
            session.close()
            print("\n[SESSION] Đã đóng kết nối an toàn.")
        except Exception:
            pass

    print("\n" + "=" * 60)
    print("✅ HOÀN THÀNH TOÀN BỘ DATA PIPELINE!")
    print(f"📊 Thống kê: {success_categories}/{total} danh mục thành công | Tổng số sách: {total_books_collected}")
    print("=" * 60)


if __name__ == "__main__":
    main()