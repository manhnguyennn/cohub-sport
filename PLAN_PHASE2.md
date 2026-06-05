# CoHub Sport — Kế hoạch Phase 2 (FE-first, trên mock)

**Owner:** Manh
**Quyết định:** **Chưa làm Backend** ở giai đoạn này → tiếp tục build **frontend trên mock layer** (`apiClient` + `mockRegistry`, `NEXT_PUBLIC_DATA_SOURCE=mock`). Backend + tích hợp thật để **deferred** (xem §4).

**Trạng thái:** MVP frontend 8 tuần feature-complete (xem [`PLAN.md`](PLAN.md) — Phase 1, KHÔNG xoá). File này là bản tiếp nối.

**Nguồn:** `FSD`, `SRS`, `PRD`, `PRD_DetailFlow_Booking_Course`, `PRD_DetailFlow_Coach_Onboarding`, `Flow_Update_Booking_V2_Hybrid_Implementation`, `KNOWLEDGE.md` (repo root).

**Nguyên tắc FE-first:**
- Mọi tính năng mới dựng UI + đăng ký endpoint giả vào `mockRegistry`, DTO theo `src/types/` (đã match BE — khi nối backend chỉ đổi env, không sửa component/service).
- Ưu tiên hoàn thiện **trải nghiệm end-to-end demo-able**, đủ nhánh state (happy + edge), không chờ backend.
- Giữ convention: AppIcon/no-emoji (§14b), dashboard shell cho CRM (§14c), container padding (§6.5), Skeleton/EmptyState, Toast.

---

## 1. Bức tranh tổng

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| Phase 1 | MVP Frontend (mock) | ✅ DONE (PLAN.md) |
| **Phase 2 (file này)** | **Hoàn thiện FE trên mock** — bộ ba Booking Hybrid, vòng đời booking, tiền/vận hành (mock), growth P1, chất lượng FE | 🟡 ĐANG LÀM |
| Phase Backend | Dựng BE thật + tích hợp (auth/payment/eKYC/chat/search/payout/compliance) | ⏸️ DEFERRED (§4) |
| Phase 3+ | Scale & Future (AI, native app, i18n EN, livestream…) | 🔮 sau PMF |

---

## 2. Roadmap FE Phase 2 (làm trên mock)

Sắp theo giá trị + phụ thuộc. Mỗi milestone ~1–2 tuần.

### 🎯 FE-M1 · Hoàn tất bộ ba Booking Hybrid (ưu tiên cao nhất)
Lý do: đây là concept lõi sản phẩm, hiện mới có 2/3 chiều.
- **Flow 1 "Theo lịch của tôi"** (chiều còn thiếu — Flow V2 §3.1, §2.2.3): toggle time-bucket (Sáng/Chiều/Tối) + day chips ở `/coaches`, **re-sort coach** theo độ khớp lịch + badge "🟢 Rảnh tuần này". Mock: matching qua open sessions (đã có `area-match`/schedule matching, mở rộng cho bucket).
- **Smart home logged-in** (Flow V2 §2.3): home cá nhân hoá khi đã đăng nhập (gợi ý theo môn đã xem/đặt, "tiếp tục đặt lại với coach cũ").
- **Badge "Coach trống lịch tuần này"** + course matched-lịch hiển thị top (Flow V2 Phase 2).
- Đóng các **Critical UX gap còn treo** (Coach Detail C-items, Course Detail K-items — verify đã fix; cái nào chưa thì xử lý).

### 🎯 FE-M2 · Hoàn thiện vòng đời booking & coach
- **Waitlist** khi course đầy (DetailFlow §B1, Flow V2 §4.2): nút "Vào danh sách chờ" + modal email capture, trạng thái "đang chờ chỗ" trong My Courses.
- **Reschedule 2 chiều** (DetailFlow §A5): học viên/coach đề xuất đổi lịch, bên kia duyệt, tối đa 1 lần — UI + mock state.
- **Check-in / attendance** (DetailFlow §A6/§B5): coach đánh dấu COMPLETED → learner xác nhận hoặc auto sau 48h (mock timer). Hiển thị ở /coach/bookings + /my/bookings.
- **Edit profile HLV (pending change)** (Onboarding §3.1/§3.2): field nhạy cảm (ảnh/tên/bio/video) → tạo "pending change", profile cũ vẫn public, badge "đang chờ duyệt"; field thường update ngay.
- **Coach verification — đủ nhánh** (Onboarding §O4): admin review có **Approve / Request-Edit (góp ý field) / Reject**; trạng thái `PENDING_BASIC_REVIEW`, `ACTIVE_UNVERIFIED`, `REJECTED`, `SUSPENDED`. **Anti-PII enforce** (chặn submit khi bio/tagline có SĐT/link, không chỉ warning).

### 🎯 FE-M3 · Tiền & vận hành (UI trên mock)
- **Payout HLV** (DetailFlow §C.3): màn số dư (pending/available), liên kết tài khoản ngân hàng (mock, KHÔNG nhập số thật — chỉ UI), yêu cầu rút (min 200k), lịch sử rút. Trong CRM coach.
- **Dispute / khiếu nại** (DetailFlow §C.5): form lý do + upload evidence (mock preview), trạng thái xử lý; **admin dispute queue** (mock decision REFUND/PAY_COACH/SPLIT/REJECT).
- **Admin nâng cao** (mock): users management (list + ban/suspend), KYC viewer placeholder (che thông tin nhạy cảm), CSV export (mock download), audit log view.
- **Notification settings**: trang cài đặt bật/tắt loại thông báo (email/push/SMS — chỉ UI toggle).

### 🎯 FE-M4 · Growth P1 (mock-able ngay)
- **Package buổi tập** (PRD §7.2): gói 5/10/20 buổi giá ưu đãi — card gói + flow mua + theo dõi số buổi còn lại.
- **Wallet Cohub** (PRD §7.2): ví số dư (từ refund mock) dùng để đặt buổi sau.
- **Referral + promo engine** (mock nâng cấp từ DEMO50): trang mời bạn + mã giảm giá + lịch sử voucher.
- **Learner onboarding quiz**: "Mục tiêu của bạn?" → gợi ý coach phù hợp.
- **Favorites / Saved coaches**: lưu localStorage, trang "Đã lưu".
- **Coach Pro tier** (UI): trang nâng cấp gói + analytics nâng cao (mock charts).

### 🎯 FE-M5 · Chất lượng FE & nền móng
- **i18n scaffolding**: tích hợp react-i18next, tách string ra key (SRS yêu cầu kiến trúc sẵn sàng) — chưa cần bản EN, chỉ chuẩn hoá.
- **Test suite**: unit cho logic lõi (booking calc, refund tier, pii filter, area-match) + E2E happy-path (Playwright) chạy trên mock.
- **A11y audit chính thức**: screen reader pass, kiểm contrast/focus toàn site, fix tồn đọng.
- **Performance**: Lighthouse ≥ 90, lazy-load ảnh/route, kiểm bundle size.
- **Mock data depth**: bổ sung state cho mọi nhánh mới (dispute, payout, suspended coach, reject onboarding, waitlist) để demo đủ.

---

## 3. Thứ tự đề xuất & cách làm

1. Bắt đầu **FE-M1** (Flow 1 "Theo lịch của tôi") — hoàn tất concept Hybrid, giá trị cao nhất.
2. Sau mỗi milestone: tsc + lint + sass sạch, verify Chrome đa persona, cập nhật PLAN/memory.
3. Mỗi feature: thêm types (`src/types/`) → mock endpoint (`src/mocks/`, đăng ký vào `index.ts`) → service (`src/services/`) → UI feature (`src/features/`) → route/page → SCSS block → wire vào nav/header nếu cần.
4. Giữ DTO khớp BE tương lai để swap không đau.

---

## 4. ⏸️ DEFERRED — Backend & tích hợp thật (khi quyết định làm BE)

Giữ lại để tham chiếu; CHƯA làm trong Phase 2 này. Khi khởi động backend, đây là các track (chi tiết NFR/endpoint trong SRS):

- **Auth thật**: OTP SMS, Google OAuth, JWT RS256, bcrypt, rate-limit (SRS FR-AUTH, SEC-AUTH).
- **Payment thật**: VNPay/Momo/ZaloPay + webhook idempotency + refund engine + hoá đơn điện tử (SRS FR-PAY, TT78).
- **eKYC thật**: OCR CCCD + liveness + face-match (SRS §9.2).
- **Realtime chat**: WebSocket, persist, content-filter enforce server-side, media upload S3 (SRS FR-CHAT).
- **Notifications thật**: FCM push + email SES + SMS (SRS §9.3–9.5).
- **Search/geo thật**: full-text VN + ranking + index near-real-time (SRS FR-SEARCH).
- **Payout thật**: pending balance, bank verify, hold T+3 (SRS FR-PAYOUT).
- **Cron jobs**: auto-decline 12h, reminders, auto-complete 48h (SRS FR-BOOK).
- **Admin RBAC + audit + 2FA** (SRS FR-ADMIN, SEC-AUDIT).
- **Bảo mật & tuân thủ**: TLS, encryption at-rest, NĐ 13/2023 (consent + quyền user), đăng ký sàn TMĐT (NĐ 52/85), data residency (SRS §8, NFR-COMP).
- **Vận hành**: CI/CD canary, monitoring/observability, IaC, runbooks, test BE (SRS §10).

> Mock layer đã match DTO → khi BE sẵn, bật `NEXT_PUBLIC_DATA_SOURCE=api` và nối từng module, FE không phải viết lại.

---

## 5. 🔮 Phase 3+ — Scale & Future (sau PMF)

AI matchmaking/recommendation · Instant book (auto-confirm) · Multi-coach package · Mobile native app · i18n EN (bản dịch) · Live streaming · Social feed · B2B Corporate · Wearable sync · Marketplace giáo trình.
(PRD §5/§7.3, Flow V2 Phase 3.)

---

## 6. Open decisions (FE-relevant)

| # | Quyết định | Khi nào cần |
|---|---|---|
| F1 | Flow 1: re-sort coach theo lịch hay chỉ filter cứng? | FE-M1 |
| F2 | Smart home logged-in: mức cá nhân hoá (chỉ "đặt lại" hay full recommend)? | FE-M1 |
| F3 | Waitlist: chỉ email capture hay giữ chỗ tạm? | FE-M2 |
| F4 | Payout/bank: UI nhập tài khoản giả tới đâu (tránh nhập số thật)? | FE-M3 |
| F5 | i18n: làm sớm (FE-M5) hay hoãn tới khi cần EN? | FE-M5 |
| D2 | Vertical launch Gym+Pickleball hay đa môn (ảnh hưởng seed mock)? | bất kỳ |

---

## 7. Việc tiếp theo ngay

**Khởi động FE-M1 — Flow 1 "Theo lịch của tôi"**: thêm toggle time-bucket + day chips vào `/coaches`, matching qua open sessions, re-sort + badge "Rảnh". Đây là mảnh còn thiếu để hoàn tất bộ ba Booking Hybrid.

Trigger: "làm FE-M1" hoặc "làm Flow 1 theo lịch của tôi".

---

_Cập nhật: 2026-06-05 — chuyển hướng FE-first (chưa làm backend). Bản tiếp nối PLAN.md (Phase 1 giữ nguyên)._
