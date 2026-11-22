import os
import json
import glob
from pymongo import MongoClient, UpdateOne

# 1. Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["noveliq_db"]
collection = db["books"]

# Xóa index "id_1" tạo nhầm ở lần chạy trước (nếu có)
if "id_1" in collection.index_information():
    collection.drop_index("id_1")

# 2. Quét toàn bộ file JSON trong thư mục products
folder_path = "Data/products/*.json"
json_files = sorted(glob.glob(folder_path))

total_processed = 0

for file_path in json_files:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not data:
        continue

    operations = []
    for item in data:
        book_id = item.get("_id")
        if book_id is None:
            continue
        operations.append(
            UpdateOne(
                {"_id": book_id},
                {"$set": item},
                upsert=True
            )
        )

    if operations:
        collection.bulk_write(operations)
        total_processed += len(operations)
        print(f"[OK] {os.path.basename(file_path)}: {len(operations)} bản ghi")

print(f"\nHoàn tất! Tổng số bản ghi đã xử lý: {total_processed}")
print(f"Tổng số sách duy nhất trong MongoDB: {collection.count_documents({})}")