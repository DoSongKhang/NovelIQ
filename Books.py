"""
=============================================================
    LẤY TẤT CẢ CÁC SẢN PHẨM SÁCH TỪ FILE CATEGORIES.CSV
=============================================================
QUY TRÌNH:
1. Đọc danh sách tất cả các category từ file "Data/categories.csv"
2. Duyệt qua từng category, dùng ID và URL Key để gọi API Tiki.
3. Retry HTTP tự động đối với những lỗi tạm thời.
4. Bóc tách thông tin sản phẩm và lọc trùng lặp (duplicate).
5. Lưu kết quả của mỗi category thành một file CSV riêng tại "Data/products/category_<ID>.csv".
"""

import os
import time
import random
import requests
import pandas as pd

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ============================================================
# 1. CONFIG FILE VÀ THƯ MỤC LƯU TRỮ
# ============================================================

CATEGORY_CSV = "Data/categories.csv"
OUTPUT_DIR = "Data/products"

# ============================================================
# 2. TIKI API
# ============================================================

API_URL = "https://tiki.vn/api/personalish/v1/blocks/listings"

# Các params cố định
FIXED_PARAMS = {
    "limit": 40,
    "include": "advertisement",
    "aggregations": 2,
    "version": "home-persionalized",
    "trackity_id": "065c7957-441c-ad9d-524e-4f326a13bc37",
}

# ============================================================
# 3. CẤU HÌNH RETRY
# ============================================================

RETRY_STRATEGY = Retry(
    total=5,
    connect=5,
    read=5,
    status=5,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
    raise_on_status=False,
)

# ============================================================
# 4. TẠO SESSION
# ============================================================

session = requests.Session()
adapter = HTTPAdapter(max_retries=RETRY_STRATEGY)

session.mount("https://", adapter)
session.mount("http://", adapter)

session.headers.update(
    {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json, text/plain, */*",
    }
)


# ============================================================
# 5. GỌI API MỘT PAGE
# ============================================================

def get_page(category_id, url_key, page):
    """Gọi Tiki Listing API cho một page và trả về danh sách sản phẩm."""
    params = FIXED_PARAMS.copy()
    params.update({
        "category": category_id,
        "page": page,
        "urlKey": url_key,
    })

    print(f"\n[REQUEST] page={page}")
    response = session.get(API_URL, params=params, timeout=20)
    
    print(f"[STATUS] {response.status_code}")
    response.raise_for_status()

    if not response.text.strip():
        raise ValueError(f"Response rỗng ở page={page}")

    try:
        result = response.json()
    except ValueError as e:
        print(f"[ERROR] Response không phải JSON ở page={page}\n{e}")
        raise

    data = result.get("data", [])
    print(f"[DATA] {len(data)} items")
    return data


# ============================================================
# 6. BÓC TÁCH PRODUCT
# ============================================================

def extract_product(product, category_id):
    """Chỉ lấy những field cần thiết để đưa vào bảng books."""
    product_id = product.get("id")
    url_key = product.get("url_key")
    product_url = f"https://tiki.vn/{url_key}.html" if url_key else None

    # Lấy value bên trong object quantity_sold (nếu có)
    quantity_sold = product.get("quantity_sold")
    if isinstance(quantity_sold, dict):
        quantity_sold = quantity_sold.get("value")

    return {
        "id": product_id,
        "url_key": url_key,
        "url": product_url,
        "name": product.get("name"),
        "rating_average": product.get("rating_average"),
        "review_count": product.get("review_count"),
        "original_price": product.get("original_price"),
        "price": product.get("price"),
        "quantity_sold": quantity_sold,
        "category_id": category_id,
    }


# ============================================================
# 7. CRAWL TOÀN BỘ SẢN PHẨM TRONG 1 CATEGORY
# ============================================================

def crawl_category(category_id, url_key):
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
                if empty_retry >= 3:
                    print(f"[STOP] page={page} -> xác nhận hết dữ liệu.")
                    return all_products

                wait_time = 3 * empty_retry
                time.sleep(wait_time)

            except requests.RequestException as e:
                print(f"[ERROR] page={page}: {e}")
                time.sleep(5)
            except ValueError as e:
                print(f"[JSON ERROR] page={page}: {e}")
                time.sleep(5)

        new_count = 0
        duplicate_count = 0

        for product in data:
            product_id = product.get("id")
            if product_id is None or product_id in seen_ids:
                if product_id in seen_ids: duplicate_count += 1
                continue

            seen_ids.add(product_id)
            all_products.append(extract_product(product, category_id))
            new_count += 1

        print(f"[EXTRACT] page={page} new={new_count} duplicate={duplicate_count}")
        print(f"[TOTAL] {len(all_products)} products")

        page += 1
        time.sleep(random.uniform(1.0, 2.0))


# ============================================================
# 8. LƯU CSV
# ============================================================

def save_csv(products, category_id, category_name):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_file = os.path.join(OUTPUT_DIR, f"category_{category_id}.csv")
    df = pd.DataFrame(products)

    # Đảm bảo thứ tự cột chuẩn
    columns = [
        "id", "url_key", "url", "name", "rating_average", 
        "review_count", "original_price", "price", 
        "quantity_sold", "category_id"
    ]
    # Gán các cột chưa có dữ liệu bằng None nếu thiếu
    for col in columns:
        if col not in df.columns:
            df[col] = None

    df = df[columns]
    df.to_csv(output_file, index=False, encoding="utf-8-sig")

    print(f"\n{'='*60}\nDONE: {category_name}\nProducts : {len(df)}\nOutput   : {output_file}\n{'='*60}")
    return output_file


# ============================================================
# 9. MAIN: CHẠY QUÉT TỪ FILE CSV
# ============================================================

def main():
    print(f"{'='*60}\nĐỌC DANH SÁCH TỪ {CATEGORY_CSV}\n{'='*60}")
    try:
        df_categories = pd.read_csv(CATEGORY_CSV)
    except FileNotFoundError:
        print(f"[LỖI] Không tìm thấy file '{CATEGORY_CSV}'. Vui lòng chạy code bóc tách category trước.")
        return

    if df_categories.empty:
        raise ValueError("File CSV không có dữ liệu!")

    total = len(df_categories)
    print(f"Tìm thấy {total} danh mục.")

    for idx, row in df_categories.iterrows():
        category_id = int(row["Category_ID"])
        category_name = row["Category_Name"]
        category_url = row["Category_URL"]
        
        # Bóc tách url_key từ link (Ví dụ: 'https://tiki.vn/du-ky/c4933' -> 'du-ky')
        try:
            url_key = category_url.split('/')[-2]
        except IndexError:
            url_key = ""

        print(f"\n[{idx+1}/{total}] Đang xử lý: {category_name} (ID: {category_id} | Key: {url_key})")
        print("-" * 60)
        
        try:
            products = crawl_category(category_id, url_key)
            if products:
                save_csv(products, category_id, category_name)
            else:
                print(f"[CẢNH BÁO] Không cào được sản phẩm nào cho danh mục {category_name}")
        except Exception as e:
            print(f"[LỖI] Danh mục {category_id} thất bại: {e}")
        
        # Nghỉ dài hơn một chút khi chuyển sang danh mục mới
        time.sleep(random.uniform(2.0, 4.0))

    print("\n" + "=" * 60)
    print("✅ HOÀN THÀNH TOÀN BỘ DATA PIPELINE!")
    print("=" * 60)

if __name__ == "__main__":
    main()