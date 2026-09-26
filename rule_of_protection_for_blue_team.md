
Hệ thống, System_Prompt phải tuân theo nhằm phòng tránh các lỗi sau:

* **Rò rỉ dữ liệu:** Liệu kết quả đầu ra có làm lộ thông tin nhận dạng cá nhân một cách bất ngờ hay không.
* **Tiêm nhanh:** Phát hiện và ngăn chặn các đầu vào độc hại được thiết kế để thao túng lời nhắc.
* **Độc tính:** Kết quả đầu ra có chứa từ ngữ tục tĩu, ngôn từ độc hại hoặc lời lẽ thù hận.
* **Quyền riêng tư:** Ngăn chặn việc nhập liệu chứa thông tin cá nhân nhạy cảm mà bạn không muốn lưu trữ..

Những nguyên tắc bảo vệ quan trọng trong chương trình LLM là:

* **Nhanh:** Điều này khá hiển nhiên và chỉ áp dụng cho các ứng dụng LLM hướng đến người dùng — các rào cản bảo vệ phải cực nhanh với độ trễ cực thấp, nếu không người dùng sẽ phải chờ khoảng 5–10 giây trước khi thấy bất cứ thứ gì trên màn hình.
* **Chính xác:** Với các cơ chế bảo vệ LLM, bạn thường sẽ áp dụng >5 cơ chế bảo vệ để bảo vệ cả đầu vào và đầu ra. Điều đó có nghĩa là nếu logic ứng dụng của bạn được viết để tái tạo đầu ra LLM ngay cả khi chỉ một bộ bảo vệ bị lỗi, bạn sẽ rơi vào tình trạng tái tạo không cần thiết (NRL). Điều này có nghĩa là, ngay cả khi các tiêu chí bảo vệ LLM của bạn có độ chính xác trung bình 90%, việc áp dụng 5 tiêu chí bảo vệ sẽ dẫn đến kết quả dương tính giả trong 40% trường hợp.
* **Đáng tin cậy:** Các thanh chắn an toàn chính xác chỉ hữu ích nếu việc nhập/xuất dữ liệu lặp đi lặp lại dẫn đến cùng một điểm số an toàn. Các điều kiện bảo vệ mà bạn triển khai trong các điều kiện bảo vệ LLM của mình cần phải nhất quán nhất có thể (chúng ta đang nói đến sự nhất quán gấp 9/10 lần) để đảm bảo rằng token không bị lãng phí vào vùng tái tạo không cần thiết trong khi dữ liệu đầu vào của người dùng không bị gắn cờ ngẫu nhiên chỉ vì sự may rủi.
* Hệ thống phải ưu tiên System_prompt hơn người dùng nhằm bảo vệ hệ thống
* **Chặn tấn công chèn lệnh độc hại:** Phát hiện và loại bỏ các đoạn mã hoặc câu lệnh cố tình đánh lừa mô hình (Prompt Injection).
* **Lọc dữ liệu nhạy cảm:** Quét và ẩn đi các thông tin như secret_key, ...

Tuyệt đối không được hard-code như yêu cầu sytem_prompt không được cung cấp các sceret_key bằng mọi giá, hệ thống cần được các prompt độc hại kiểm tra


```
User
  → Rate Limiter          (chống spam)
  → Input Guardrails      (chặn jailbreak / lạc đề TRƯỚC khi gọi LLM)
  → LLM
  → Output Guardrails     (redact PII / secret SAU khi LLM trả lời)
  → Audit + Monitoring    (ghi nhật ký + metrics)
  → Reply / Egress check  (không cho secret thoát ra domain lạ)
```
