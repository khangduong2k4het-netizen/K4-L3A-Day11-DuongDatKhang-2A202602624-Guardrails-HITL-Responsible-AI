# Frontend demo

Chạy tại thư mục gốc repo, dùng Python 3.10+ và môi trường đã cài dependencies của lab:

```powershell
python -m pip install -r requirements.txt
python src/demo.py
```

Mở **http://127.0.0.1:8080**. Đổi cổng bằng `python src/demo.py --port 8081`.

- **Kiểm tra input:** chạy `detect_injection` và `topic_filter` thật, không cần API key. Không đánh giá output hay khẳng định prompt an toàn.
- **Blue Team:** gọi `create_blue_agent` với production plugins hiện có. Cần `OPENROUTER_API_KEY` trong `.env`. Có phí API theo tài khoản. LLM judge và NeMo không được bật.
- Chọn các prompt hiện có trong `adversarial_prompts` hoặc tự nhập, tối đa 8.000 ký tự.
- Trạng thái chặn/lọc ở chế độ live lấy từ thay đổi bộ đếm plugin. “Đã trả lời” không khẳng định model tuân thủ yêu cầu hay không rò rỉ; câu từ chối của model cũng là một phản hồi.
- Input checks hiển thị là phép kiểm tra độc lập; lớp xử lý live là lớp thực sự chặn/lọc. Rate limit dùng chung cho server demo, giữ qua các lượt. Khởi động lại server sẽ reset.
- Lịch sử chỉ tồn tại trong bộ nhớ trình duyệt; không ghi vào `outputs/`. Nút xóa lịch sử không reset rate limit.
- Đây là server demo một người dùng, chạy tuần tự trên loopback; mỗi prompt là một thử nghiệm độc lập, không phải chat nhiều lượt. Dừng bằng Ctrl+C.
