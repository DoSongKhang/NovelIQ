"""
Gọi API tại thể loại "Sách tiếng Việt" trong Tiki-shop
và lấy tất cả các thông tin về các thể loại con và thể loại cháu
---------------------------------------------------------------
Sau đó trả về file json với tên gọi "categories_316.json" nằm trong mục data
"""

import requests
import json
import os

url = "https://tiki.vn/api/v2/categories"


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

params = {"include": "children", "parent_id": 316}

response = requests.get(url, params=params, headers=headers)
response.raise_for_status()

data = response.json()

os.makedirs('Data', exist_ok=True)
with open("Data/categories_316.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
