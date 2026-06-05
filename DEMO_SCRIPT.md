# CoHub Sport — Kịch bản demo cho nhà đầu tư (10 phút)

Storyboard đi qua 3 persona để kể trọn vòng đời giá trị: **học viên tìm & đặt HLV → HLV vận hành → Admin kiểm soát chất lượng**.

## Chuẩn bị (trước khi bắt đầu)

1. Chạy `npm run dev`, mở `http://localhost:3000`.
2. Nhấn `Ctrl + Shift + D` mở **Demo Mode panel**.
3. Bật **Investor mode** (tăng tốc timer 5× để không phải chờ).
4. Bắt đầu ở persona **Guest**.

> Mỗi lần đổi persona: mở panel → chọn persona. Mock state reset khi điều hướng full-page, nên cứ demo tuyến tính theo thứ tự dưới.

---

## Phút 0–1 · Mở màn (Guest) — Vấn đề & định vị

- Vào trang chủ `/`. Nhấn mạnh hero: "Tìm đúng coach. Bứt phá đúng cách."
- **Câu chuyện:** thị trường HLV cá nhân phân mảnh, học viên khó tìm người uy tín, giao dịch trôi ra ngoài (Zalo/tiền mặt) → không an toàn, nền tảng mất phí.
- Bấm thanh tìm kiếm → mở modal chọn **môn thể thao + khu vực**, bật "lọc theo lịch cá nhân hoá".

## Phút 1–2 · Khám phá HLV (Guest → Linh)

- Submit tìm kiếm → trang `/coaches`: lưới HLV 3 cột, toolbar lọc nhanh + nút **Bộ lọc** chi tiết (modal), "Tải thêm".
- Nhấn mạnh: 50 HLV mock, đều có badge **đã xác minh**, rating, khu vực.
- Mở 1 HLV → `/coaches/[id]`: bio, chuyên môn, đánh giá, và khối **Lịch dạy mở**.
- Đổi persona sang **Linh (Học viên)** để có trạng thái đăng nhập.

## Phút 2–4 · Đặt buổi (Linh) — Lõi sản phẩm

- Bấm **Đặt lịch** → modal calendar 30 ngày: chọn nhiều buổi từ lịch HLV đã mở.
- Cho xem toggle **"Đặt lịch riêng"** — học viên yêu cầu khung giờ riêng, giá tạm tính, chờ HLV xác nhận.
- Tiếp tục → `/checkout`: cổng thanh toán giả (VNPay/Momo/ZaloPay), nhập mã **DEMO50** (giảm 50k).
- Nhấn thanh toán → 2s → trang xác nhận với timeline `Đã thanh toán → Chờ HLV → CONFIRMED`.
- **Điểm nhấn:** tiền được giữ trên nền tảng, chỉ chuyển cho HLV sau khi buổi hoàn thành → niềm tin 2 chiều.

## Phút 4–5 · Communication (Linh) — Giữ giao dịch trong nền tảng

- Vào `/messages`: chat 2 chiều với HLV. Gửi 1 tin → HLV "trả lời" sau 2s.
- **Demo bộ lọc:** gõ thử số điện thoại → cảnh báo đỏ chặn gửi "Không chia sẻ thông tin liên hệ ngoài CoHub".
- **Story:** đây là cách nền tảng chống rò rỉ giao dịch — bảo vệ doanh thu.
- Bấm chuông 🔔 ở header → dropdown thông báo (booking, tin nhắn, thanh toán).

## Phút 5–6 · Đánh giá (Linh) — Vòng lặp tin cậy

- Vào `/my/bookings` → tab **Đã hoàn thành** → bấm **Đánh giá**.
- Modal: chọn sao + tag (Đúng giờ, Nhiệt tình…) + nhận xét.
- Nhấn mạnh **double-blind 7 ngày** — chống review trả đũa, dữ liệu đánh giá sạch.

## Phút 6–8 · Phía HLV (Khoa) — Công cụ vận hành

- Đổi persona sang **Khoa (HLV đã xác minh)**. Lưu ý giao diện chuyển sang **Coach Studio** (layout SaaS riêng, sidebar + topbar — không còn header/footer site).
- `/coach/dashboard`: 4 chỉ số (GMV tháng +18%, 23 buổi, học viên mới, rating 4.9) + biểu đồ doanh thu 30 ngày.
- `/coach/bookings`: inbox booking — **Xác nhận** / **Từ chối** (kèm cảnh báo uy tín).
- Lướt nhanh `/coach/sessions` (mở lịch dạy) + `/coach/courses` (tạo khoá học).
- **Story:** HLV có CRM nhẹ để biến chuyên môn thành thu nhập, nền tảng ăn phí trên mỗi giao dịch.

## Phút 8–9 · Kiểm soát chất lượng (Admin)

- Đổi persona sang **Admin**. Vào **Admin Console** → `/admin/reviews`.
- Hàng chờ duyệt HLV sắp theo **deadline SLA**, badge tier (Hồ sơ cơ bản / Xác minh KYC), đồng hồ đếm ngược đỏ khi gấp.
- Mở 1 hồ sơ → drawer phải: profile + chứng chỉ + **checklist 7 tiêu chí** → Duyệt / Từ chối / Yêu cầu sửa.
- **Story:** chất lượng HLV được kiểm duyệt 2 tầng → đây là moat niềm tin của marketplace.

## Phút 9–10 · Chốt

- Tóm tắt vòng giá trị: **khám phá → đặt & thanh toán an toàn → giao tiếp trong nền tảng → đánh giá → HLV vận hành → admin kiểm soát.**
- Nhắc lại điểm kiếm tiền: phí trên mỗi booking/khoá; chống rò rỉ giao dịch ra ngoài.
- Mời câu hỏi.

---

## Mẹo trình diễn

- **Investor mode** đang bật → mọi chờ đợi rút còn ~1s.
- Nếu lỡ tay, refresh trang để reset state mock về mặc định của persona.
- Muốn demo luồng lỗi thanh toán: bật **Force payment fail** trong Demo panel trước khi checkout.
- Mọi số liệu là mock được thiết kế để "đẹp" cho demo — không phải dữ liệu thật.
