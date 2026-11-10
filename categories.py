import requests
import pandas as pd

# 1. Khai báo URL API
url = "https://tiki.vn/api/v2/categories?include=children&parent_id=839"

# 2. Cấu hình Headers mô phỏng trình duyệt để tránh bị chặn (Anti-bot)
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://tiki.vn/sach-truyen-tieng-viet/c316'
}

# 3. Gửi Request lấy dữ liệu
response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    categories_list = []
    
    # 4. Duyệt qua mảng 'data' chứa các thể loại con
    for item in data.get('data', []):
        cat_id = item.get('id')
        cat_name = item.get('name')
        cat_url_path = item.get('url_path', '')
        
        # Ghép đường link đầy đủ tới danh mục đó trên Tiki
        full_url = f"https://tiki.vn/{cat_url_path}" if cat_url_path else f"https://tiki.vn/c{cat_id}"
        
        categories_list.append({
            'Category_ID': cat_id,
            'Category_Name': cat_name,
            'Category_URL': full_url
        })
    
    # 5. Đưa dữ liệu vào DataFrame để dễ quản lý
    df = pd.DataFrame(categories_list)
    
    print(f"--- ĐÃ LẤY THÀNH CÔNG {len(df)} THỂ LOẠI ---")
    
    # 6. Lưu kết quả ra file CSV
    df.to_csv('tiki_categories.csv', index=False, encoding='utf-8-sig')
    print("\n[OK] Đã lưu danh sách thể loại vào file 'tiki_categories.csv'")

else:
    print(f"Lỗi gọi API. Mã trạng thái: {response.status_code}")