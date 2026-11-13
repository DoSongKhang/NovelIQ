# Categories.py


## Phần Khởi tạo (Import thư viện)
Trước khi vào phần chính, code của bạn gọi ra 3 "công cụ" (thư viện):
*   `import requests`: Thư viện dùng để gửi các yêu cầu mạng (như truy cập một trang web).
*   `import os`: Thư viện giao tiếp với hệ điều hành (dùng để tạo thư mục, quản lý file).
*   `import pandas as pd`: Thư viện xử lý dữ liệu dạng bảng cực mạnh (đặt tên tắt là `pd`).

---

## Phần 1: Khai báo URL API

**Chức năng tổng quát:** 
Xác định chính xác "địa chỉ nhà" (endpoint) của máy chủ chứa dữ liệu mà bạn muốn lấy. Ở đây là API lấy danh sách các danh mục con của danh mục sách (có `parent_id=839`) từ hệ thống Tiki.

**Giải thích từng dòng:**
*   `url = "https://tiki.vn/..."`: Tạo một biến tên là `url` và gán cho nó một chuỗi (string) là đường link API của Tiki. Thông số `parent_id=839` cho server biết bạn chỉ muốn lấy danh mục con của ID 839 (thường là danh mục Sách tiếng Việt).

---

## Phần 2: Cấu hình Headers

**Chức năng tổng quát:** 
Đây là bước "ngụy trang". Hầu hết các trang web lớn như Tiki đều có hệ thống chống bot cào dữ liệu. Nếu bạn gửi yêu cầu bằng code thuần túy, server sẽ nhận ra và chặn (trả về lỗi 403). Phần Headers này giúp code của bạn đóng giả làm một trình duyệt web thật của một người dùng bình thường.

**Giải thích từng dòng:**
*   `headers = { ... }`: Khởi tạo một kiểu dữ liệu dạng Từ điển (Dictionary) chứa các thông tin ngụy trang.
*   `'User-Agent': 'Mozilla/5.0...'`: Dòng quan trọng nhất. Nó khai báo với Tiki rằng: "Tôi đang dùng hệ điều hành Windows 10, trình duyệt Google Chrome phiên bản 120".
*   `'Accept': ...`: Khai báo loại dữ liệu mà bạn muốn nhận về (ở đây là JSON hoặc text).
*   `'Accept-Language': ...`: Khai báo ngôn ngữ ưu tiên là Tiếng Việt, sau đó đến Tiếng Anh.
*   `'Referer': ...`: Khai báo "nguồn gốc" cú click chuột. Nó đánh lừa server rằng bạn đang đứng ở trang `sach-truyen-tieng-viet/c316` rồi mới gọi API này.

---

## Phần 3: Gửi Request lấy dữ liệu

**Chức năng tổng quát:** 
Thực hiện hành động "gõ Enter" để gửi yêu cầu đến server Tiki (mang theo cả cái địa chỉ URL và lớp ngụy trang Headers), sau đó kiểm tra xem máy chủ có phản hồi thành công hay không.

**Giải thích từng dòng:**
*   `response = requests.get(url, headers=headers)`: Dùng hàm `get` của thư viện `requests` để truy cập vào `url`, đồng thời đính kèm `headers` ngụy trang. Kết quả trả về (thành công, thất bại, dữ liệu thô) được lưu vào biến `response`.
*   `if response.status_code == 200:`: Kiểm tra mã trạng thái phản hồi. Trong HTTP, mã `200` có nghĩa là "Thành công" (OK). Nếu mã là 200, code mới thực thi các bước bên trong.

---

## Phần 4: Xử lý dữ liệu và Duyệt mảng

**Chức năng tổng quát:** 
Dữ liệu server trả về là một cục JSON lớn chứa rất nhiều thông tin dư thừa. Phần này có nhiệm vụ phân tích cú pháp (parse) cục JSON đó, tìm đúng danh sách các thể loại, dùng vòng lặp đi qua từng thể loại một để nhặt ra 3 thông tin cần thiết: ID, Tên, và Link.

**Giải thích từng dòng:**
*   `data = response.json()`: Chuyển đổi dữ liệu thô từ server thành kiểu Dictionary của Python để dễ dàng truy xuất.
*   `categories_list = []`: Tạo một danh sách (list) trống rỗng để chứa dữ liệu ta sắp nhặt được.
*   `for item in data.get('data', []):`: Vòng lặp lấy giá trị của key `'data'` (chứa danh sách các thể loại). Dùng `.get()` là một thói quen code rất tốt để nếu server trả về thiếu key này thì code sẽ trả về mảng rỗng `[]` chứ không bị văng lỗi (Crash).
*   `cat_id = item.get('id')`: Nhặt ID của thể loại lưu vào biến `cat_id`.
*   `cat_name = item.get('name')`: Nhặt tên thể loại.
*   `cat_url_path = item.get('url_path', '')`: Nhặt đường dẫn. Nếu không có thì gán bằng chuỗi rỗng `''`.
*   `full_url = f"https://tiki.vn/{cat_url_path}" if cat_url_path else f"https://tiki.vn/c{cat_id}"`: Đây là lệnh if-else viết tắt trên 1 dòng. Ý nghĩa: Nếu có `cat_url_path` thì nối nó vào sau `https://tiki.vn/`, nếu không có thì nối chữ `c` và ID (cách Tiki định dạng URL mặc định).
*   `categories_list.append({...})`: Nhét cả 3 thông tin vừa nhặt được (được gom lại thành 1 Dictionary) vào cái danh sách trống đã tạo ở trên.

---

## Phần 5: Đưa dữ liệu vào DataFrame

**Chức năng tổng quát:** 
Chuyển đổi dữ liệu từ dạng Danh sách (List) thuần túy của Python sang cấu trúc Bảng 2 chiều (DataFrame) của Pandas. Dạng bảng này giống hệt file Excel (có cột, có dòng), giúp ta dễ dàng tính toán, lọc dữ liệu hoặc xuất ra file.

**Giải thích từng dòng:**
*   `df = pd.DataFrame(categories_list)`: Đổ toàn bộ danh sách `categories_list` vào hàm `DataFrame`. Pandas sẽ tự động lấy các keys (Category_ID, Category_Name, Category_URL) làm tiêu đề cột, và mỗi phần tử trong list sẽ là một dòng.
*   `print(f"--- ĐÃ LẤY THÀNH CÔNG {len(df)} THỂ LOẠI ---")`: Hàm `len(df)` dùng để đếm xem bảng `df` có bao nhiêu dòng (tương ứng với số thể loại). Sau đó in ra màn hình để bạn biết tiến độ.

---

## Phần 6: Lưu kết quả ra file CSV và Xử lý ngoại lệ

**Chức năng tổng quát:** 
Lưu cái bảng dữ liệu vừa tạo thành một file CSV cứng trên ổ đĩa để dùng cho các bước sau (như đưa vào SQLite3, MongoDB hoặc phân tích bằng Pandas). Cuối cùng là khối lệnh xử lý nếu phần 3 gọi API thất bại.

**Giải thích từng dòng:**
*   `os.makedirs('Data', exist_ok=True)`: Tạo một thư mục có tên là `Data`. Tham số `exist_ok=True` cực kỳ hữu ích: nó báo cho Python biết rằng "nếu thư mục này đã có sẵn rồi thì cứ bỏ qua, đừng báo lỗi".
*   `df.to_csv('Data/categories.csv', index=False, encoding='utf-8-sig')`: Lưu bảng `df` thành file CSV nằm trong thư mục Data. 
    *   `index=False`: Bỏ qua cột số thứ tự 0, 1, 2... do Pandas tự tạo ra (vì mình không cần).
    *   `encoding='utf-8-sig'`: Đây là chuẩn bảng mã giúp file CSV khi mở bằng Microsoft Excel sẽ không bị lỗi font Tiếng Việt.
*   `print("\n[OK] ...")`: In ra thông báo thành công.
*   `else:` (Đi kèm với câu lệnh `if` ở phần 3): Nếu mã trạng thái `status_code` khác 200 (ví dụ bị chặn ra lỗi 403, hoặc lỗi server 500).
*   `print(f"Lỗi gọi API. Mã trạng thái: {response.status_code}")`: Báo cho bạn biết việc kết nối đã thất bại và in ra mã lỗi cụ thể để bạn biết đường khắc phục.

---

> **Tổng kết:** Cấu trúc code này của bạn rất chuẩn chỉnh và gọn gàng cho một pipeline thu thập dữ liệu (ETL). Bạn có thể áp dụng nguyên bộ khung này (đổi URL, đổi cách parse JSON) cho hầu hết các API RESTful khác.