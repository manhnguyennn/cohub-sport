# CoHub Sport — MVP Frontend Build Plan

**Owner:** Manh
**Stack:** Next.js 14 App Router · TypeScript strict · SCSS (design tokens v2) · React Context state
**Mục đích:** (a) Investor demo, (b) User testing 20-30 người để validate hypothesis
**Source of truth:**
- `PRD_Cohub_Sport.md` (vision + scope)
- `FSD_Cohub_Sport_MVP_Frontend.md` (blueprint chính — đọc trước)
- `SRS_Cohub_Sport.md` (NFR, compliance)
- `PRD_Cohub_Sport_DetailFlow_Coach_Onboarding.md` (flow O0-O9)
- `PRD_Cohub_Sport_DetailFlow_Booking_Course.md` (flow A1-A7, B1-B6)

---

## 0. Decisions đã chốt

| Quyết định | Đã chốt |
|---|---|
| **Mock layer** | Giữ `apiClient` + `mockRegistry` (đã chuẩn DTO, swap BE chỉ đổi flag `isMock`). KHÔNG migrate MSW. |
| **State management** | React Context + manual `localStorage` (KHÔNG Zustand) |
| **Deploy** | Đã deploy (ngoài scope plan — không quản lý ở đây) |
| **Thứ tự build** | Bắt đầu từ tuần 1 Foundation → đi tuần tự |
| **Path aliases** | `@components @features @services @lib @hooks @config @app-types @mocks @styles @contexts` |
| **Date/Form** | dayjs + locale vi · react-hook-form + zod |
| **Charts** | Recharts (cho dashboard tuần 5) |
| **Animation** | Framer Motion (selective) — đã pin v11.18.2 |

---

## 1. Tiến độ Hero Flows (FSD §2.1)

| Flow | Mục đích | Trạng thái | Tuần |
|---|---|---|---|
| **Foundation** | Personas, auth hook, demo mode, toast, skeleton | ✅ DONE | 1 |
| **H1** Landing → Search → Coach detail → Book → Payment → Confirmation | Learner happy path | ✅ DONE | 2 |
| **H2** Landing → Course → Detail → Enroll → Payment → My courses | Course flow | ✅ DONE | 3 |
| **H3** Sign up → Coach onboarding 5 bước → Submit → Approval | Coach onboarding | ✅ DONE | 4 |
| **H4** Coach dashboard → Tạo course → Public | Coach side dynamic | ✅ DONE | 5 |
| **H5** Coach inbox booking → Confirm | Coach ops | ✅ DONE | 6 |
| **H6** Admin queue → Approve coach | Admin quality control | ✅ DONE | 6 |
| **Communication** Chat 2 chiều + Notifications + Review form | Messaging/notif/review | ✅ DONE | 7 |
| **Polish + Docs** | a11y, responsive, 404/empty states, demo script, README | ✅ DONE | 8 |

---

## 2. Trạng thái codebase hiện tại

### 2.1 Pages đã build

| Route | Mô tả | Trạng thái |
|---|---|---|
| `/` | Home — Hero search-bar (Airbnb-style) mở `SportSearchModal` (môn + khu vực + toggle lịch cá nhân hoá) → `/coaches` filtered. 12 sections. | ✅ |
| `/coaches` | Coach list **redesign V2**: `CoachToolbar` inline (search + sort + nút Bộ lọc) + `CoachFilterModal` (hero-style, KHÔNG sidebar) + grid 3-per-row vertical card + "Tải thêm" load-more. URL state. | ✅ |
| `/coaches/[id]` | Coach Profile Detail. Booking panel **tối giản** (bỏ ready/policy, badge "lịch gần nhất" nhỏ, focus nút Đặt lịch). `CoachBookingModal` = calendar 30 ngày multi-select + toggle "Đặt lịch riêng" (custom request). Section "Lịch dạy mở", similar, FAQ. | ✅ |
| `/courses`, `/courses/[id]` | Course list + detail (50 course, load-more). | ✅ |
| `/coach/*` | CRM coach — **Dashboard Shell SaaS** (sidebar+topbar riêng): dashboard, bookings, sessions, courses, calendar. | ✅ |
| `/admin/*` | Admin Console — Dashboard Shell SaaS: dashboard, reviews. | ✅ |
| `/showcase` | Legacy home v1 (parked) | ✅ |

### 2.2 Foundation đã có (tuần 1)

| Layer | File | Purpose |
|---|---|---|
| Persona system | `src/types/persona.ts`, `src/mocks/personas.mock.ts` | 4 personas: guest / linh / khoa / admin |
| Context — Persona | `src/contexts/PersonaContext.tsx` | `usePersona()` + localStorage persist |
| Context — Toast | `src/contexts/ToastContext.tsx` | `useToast()` — success/error/info/warning |
| Context — Demo Mode | `src/contexts/DemoModeContext.tsx` | `useDemoMode()` + `Ctrl+Shift+D` hotkey + `?demo=1` |
| Auth hook | `src/hooks/useAuth.ts` | `requireLogin()`, `requireRole()`, swap BE-ready |
| Storage helper | `src/lib/persona-storage.ts` | localStorage abstraction |
| Date utils | `src/lib/date.ts` | dayjs vi: `formatDate`, `formatNextSlot`, `formatRelative`, `formatVND` |
| UI Skeleton | `src/components/ui/Skeleton.tsx` | `SkeletonCard / SkeletonList / SkeletonDetail` |
| Demo panel | `src/components/demo/DemoModePanel.tsx` | Persona switcher + 4 toggles + reset |
| Header upgrade | `src/components/layout/Header.tsx` | User chip + dropdown + role switcher + Demo trigger |

### 2.3 Service layer + Mock

- `src/lib/apiClient.ts` — single switch: `isMock ? mockCall : realCall`
- `src/lib/mockRegistry.ts` — pattern `registerMock('GET /coaches', handler)`, support `:param`. **Chạy cả server + client** với state in-memory RIÊNG (không persist; full nav reset).
- Services: `coach`, `sport`, `review`, `booking`, `auth`, `openSession`, `dashboard`, `admin`, `payment`, `promo`, `onboarding`, `course`
- Mocks (14 file): `coaches.mock.ts` (**50 coach** = 8 literal + `genCoaches` 42), `courses.mock.ts` (**50 course / 13 template**), `sports.mock.ts` (17 sport), `reviews.mock.ts`, `bookings.mock.ts`, `openSession.mock.ts`, `dashboard.mock.ts`, `admin.mock.ts` (4 hồ sơ duyệt), `payment.mock.ts`, `promo.mock.ts`, `onboarding.mock.ts`, `auth.mock.ts`, `personas.mock.ts`
- Lib matching: `src/lib/area-match.ts` (`matchesArea`/`cityKey` — normalize diacritic), `src/lib/dashboard-routes.ts` (`isDashboardRoute`)

### 2.4 Design system

- `src/styles/_tokens.scss` — color, type scale, spacing, radius, shadow, animation v2
- `src/styles/blocks/` — header, footer, button, card, input, badge, coach-card, coach-list, coach-detail, sport-card, home-hero, home-categories, showcase, toast, demo-panel, skeleton
- `src/styles/_feature.scss` — Home sections (1731 dòng sau refactor, khử 31 chỗ `calc(N/1440*100vw)`)

---

## 3. Phased Plan (8 tuần)

### ✅ Tuần 1 — Foundation + Demo Mode (DONE)

Xem §2.2.

---

### 🟡 Tuần 2 — Auth + Booking flow (H1 complete)

**Output:** Learner search → click coach → book buổi → pay → nhận confirmation. End-to-end demo-able.

**Routes:**
- `/auth/login` — phone + Google persona picker modal
- `/auth/signup` — same UI tab
- `/auth/otp` — 6-ô OTP input (FSD §3.5: "111111" fail, bất kỳ 6 số khác pass)
- `/booking/new?coachId=&slot=` — form (location radio, note, health, participants, promo "DEMO50")
- `/checkout` — fake gateway modal (VNPay/Momo/ZaloPay), progress 2s, default success
- `/booking/[id]` — success state với timeline `Paid → Đang chờ coach → CONFIRMED` (3s auto)
- `/my/bookings` — tabs Sắp tới / Đã hoàn thành / Đã huỷ

**Components mới:**
- `OtpInput` — 6 separate cells, auto-focus next, paste support
- `FakePaymentModal` — VNPay/Momo/ZaloPay branded UI + progress bar 2s
- `BookingTimeline` — pill steps Paid → Pending → Confirmed → Done
- `CancelBookingModal` — refund amount theo policy (≥24h 100% / 6-24h 50% / <6h 0%)

**Mock cần thêm:**
- `bookings.mock.ts` mở rộng — sinh booking cho persona Linh (1 upcoming, 2 completed)
- `payment.mock.ts` — fake gateway response + force-fail logic theo Demo Mode toggle
- `promo.mock.ts` — `DEMO50` = -50k, `INVALID` = inline error

**Service cần thêm:**
- `bookingService.create(input)` — đã có, mở rộng response
- `bookingService.list({status})` — list cho /my/bookings
- `bookingService.cancel(id)` — return refund_amount + breakdown
- `paymentService.charge(input)` — mới
- `promoService.validate(code)` — mới

**Acceptance:**
- Click slot trên coach detail → /booking/new pre-filled
- Submit form → /checkout → click pay → progress 2s → /booking/[id]?status=success
- 3s sau toast "Coach Khoa đã xác nhận" + status đổi
- Demo Mode "Force payment fail" toggle → next pay = fail modal đỏ
- Refresh /my/bookings giữ data (persist mock state trong localStorage)

---

### 🔴 Tuần 3 — Course flow (H2 complete)

**Output:** Browse course → enroll → payment → My Course với progress.

**Routes:**
- `/courses` — list + filter (sport, level, schedule_type FIXED/FLEXIBLE), tab từ search
- `/courses/[id]` — Course Detail (lịch khai giảng, 8 buổi cụ thể, số chỗ, urgency badge, waitlist)
- `/courses/[id]/enroll` — form (health, goal, policy checkbox) + hold seat 15min countdown
- `/checkout` — reuse từ tuần 2 (mode=enrollment)
- `/my/courses` — list với progress bar
- `/my/courses/[id]` — bảng 8 buổi, status, chat coach, Huỷ với refund

**Type mới:** Tách `Course` thành standalone (hiện đang nested trong `CoachCourse`)

**Mock policies:**
- 8 FIXED + 4 FLEXIBLE = 12 course
- 4 course "1-2 seat còn" → urgency
- 1 "đã đầy" → waitlist
- 1 "đã bắt đầu" → CTA disabled
- 2 course cover đẹp wow factor

**Refund policy (PRD A2 + B):**
- Course Fixed huỷ ≥7d: 100% / 48h-7d: 70% / <48h: 30% / mid-course: pro-rated 50%
- Course Flexible: chỉ refund credit chưa dùng

---

### 🔴 Tuần 4 — Coach Onboarding (H3 complete)

**Output:** Sign up coach → wizard 5 bước → submit → 5s auto-approve → profile public.

**Routes:**
- `/become-coach` — landing pitch (lợi ích, doanh thu trung bình mock, testimonial)
- `/coach/onboarding` — wizard 5 bước (PRD Onboarding §O1):
  - **O1.1** Cơ bản: ảnh, tên, giới tính, năm sinh, TP
  - **O1.2** Chuyên môn: bộ môn 1-3, kinh nghiệm, cấp độ, đối tượng
  - **O1.3** Bio: tagline 10-80 chars, bio 100-1500 chars, phương pháp, thành tích, video, ảnh portfolio
  - **O1.4** Khu vực & Hình thức: quận max 5, 3 hình thức (offline/online/hybrid)
  - **O1.5** Giá & Lịch: 60p/90p/group, lịch trống mặc định
- `/coach/onboarding/preview` — render profile như learner thấy
- `/coach/verification` — Tầng 2: CCCD upload + 1-10 chứng chỉ, progress bar 3-step mô phỏng eKYC 4s

**Components mới:**
- `Stepper` — top horizontal 5 dots
- `Wizard` — orchestrator (next/back/save draft, validation per step)
- `AntiPiiBio` — `<textarea>` + regex filter inline warning (phone VN, URL, Zalo/Telegram link)
- `ImageUpload` — drag-drop, `URL.createObjectURL` preview (không upload thật)
- `CertificateUpload` — multi với metadata form

**Mock behavior:**
- Auto-save 5s vào `localStorage['coach_onboarding_draft']` (NFR SRS)
- Submit → status `PENDING_BASIC_REVIEW` → 5s background → auto-approve → notification "Profile đã online!" (KHÔNG emoji — §14b) → redirect dashboard
- Investor mode tăng tốc 5s → 1s (theo `withDelay()`)

---

### 🔴 Tuần 5 — Coach Dashboard + Course Manager (H4 complete)

**Output:** Coach Khoa có dashboard data đẹp, tạo course mới, manage calendar.

**Routes:**
- `/coach/dashboard` — banner "Profile đang online", 4 stat cards, graph revenue 30d (Recharts), recent bookings 5 dòng, inbox preview 3 chat
- `/coach/courses` — list course cards của coach + enrollment count
- `/coach/courses/new` — wizard 5 bước:
  - Loại lịch (FIXED/FLEXIBLE) visual chọn lớn
  - Thông tin (title, sport, level, mô tả)
  - Lịch & số buổi
  - Giá & sĩ số
  - Cover + preview
- `/coach/calendar` — week + month view toggle, slot color code (available/booked/blocked/course), recurring availability panel

**Recharts:** LineChart revenue 30d trend tăng, BarChart bookings by day

---

### ✅ Sprint chen — Lịch dạy mở (Open Sessions) — **DONE**

**Vì:** Concept booking trước đây thiếu chiều "coach pre-publish từng buổi cụ thể với giá riêng". User confirm: muốn thay thế custom slot picker bằng catalog buổi do coach đăng trước.

**UX writing key:** **Lịch dạy mở** (vs "Khoá học" gói nhiều buổi).

**Data model mới (`@app-types/openSession`):**
- `OpenSession` — ngày-giờ + giá + sĩ số + level + location + note, status open/full/cancelled/completed
- Mock + service + recurring expansion (T2+T4 trong 4 tuần → 12 buổi tự động)

**Coach side:**
- `/coach/sessions` — list 3 tab (Sắp tới / Đã xong / Tất cả), card có capacity bar + price + huỷ
- `/coach/sessions/new` — wizard 3 bước (Đơn lẻ vs Lặp lại → Thông tin+Lịch → Giá+Preview)
- `/coach/calendar` — tích hợp slot màu cam "Lịch mở" / "Đã đầy"
- `/coach/dashboard` — quick-nav strip 4 module (Lịch mở · Khoá học · Lịch tổng · Booking)

**Learner side:**
- `/coaches/[id]` — section "Lịch dạy mở" full-width, card có time + chips (1-1/Nhóm, level, location) + Đặt buổi này
- `/booking/session/[id]` — confirm session đã chọn (slot read-only) + note/health + promo + checkout
- `/booking/new?coachId=...` legacy → redirect coach detail #open-sessions
- Mobile sticky CTA: trỏ session gần nhất có giá thực

**Integration:**
- CheckoutClient bump bookedCount qua `POST /open-sessions/:id/book` sau khi tạo booking
- Header coach quick-links: Dashboard / Lịch dạy mở / Khoá học / Lịch tổng quan
- BookingDraft thêm field `openSessionId` tracking

**Routes mới:** `coachSessions`, `coachSessionNew`, `coachSessionEdit(id)`, `bookingSession(id)`

**SCSS:** _coach-open-sessions.scss (block riêng), bổ sung cms-tabs/cms-session-card/cms-preview-list/cms-quicknav/cms-banner__actions vào _coach-cms.scss, booking-form__coach-note/__warn vào _booking.scss

---

### ✅ Sprint chen — Booking V2 Hybrid + UI/UX overhaul — **DONE** (2026-06-05)

**Vì:** Sau khi có Open Sessions, giao diện booking/landing/coach list cần làm lại theo `Flow_update_booking_v2_implement` (hybrid: lịch mở + đặt lịch riêng), tuân thủ design token hiện tại, KHÔNG làm mới token.

- **Hero V2:** single search-bar Airbnb-style → `SportSearchModal` (`features/home/sections/`) chọn môn (chips) + khu vực (`AreaMultiSelect`) + toggle "Lọc theo lịch cá nhân hoá" → `/coaches` đã filter.
- **`/coaches` redesign:** bỏ sidebar filter → `CoachToolbar` (search + sort + nút Bộ lọc) inline trong content + `CoachFilterModal` (hero-style, full filter) + card vertical 3-per-row + "Tải thêm" (cumulative paging pageSize=page×12). `features/coaches/components/`.
- **`AreaMultiSelect`** (`components/ui/`): combobox kiểu Select2 — search + autocomplete + multi-select. Matching backend: `lib/area-match.ts` (`matchesArea`/`cityKey`) + schedule (days/time) matching qua open sessions.
- **Coach detail tối giản:** booking panel bỏ "sẵn sàng nhận học viên" + cancellation policy (chuyển sang checkout), "lịch gần nhất" → badge nhỏ. `CoachBookingModal` (`features/coaches/components/`, `createPortal` → body): calendar 30 ngày, multi-select trực tiếp từ calendar, danh sách buổi hiển thị full, **toggle "Đặt lịch riêng"** = custom request (giá tạm tính riêng, status `pending` chờ coach).
- **Custom booking:** `CreateBookingInput.isCustomRequest?: boolean` + `price`/`openSessionId`. Mock honor giá + gắn note "Đặt lịch riêng — chờ coach xác nhận giá". (KHÔNG có status riêng `PENDING_COACH` — dùng flag + `pending`.)
- **Universal components** (`components/shared/`): `TrustStrip`, `CoachMiniBadge`, `CancellationPolicy`.
- **Dense mock:** 50 coach + 50 course (generator) + load-more.
- **iconsax / no-emoji (CRITICAL §14b):** cấm emoji UI toàn hệ thống, thay bằng `AppIcon` (wrapper iconsax-reactjs, semantic name→icon). Convention §14b.
- **Mobile:** container padding 14px L/R (`$spacing-page-x`), overflow-x boxes sát lề + child first/last inset 14px (edge-scroll mixin). Convention §6.5/§6.6.

**SCSS:** home-hero, coach-list, coach-detail update; book-modal; sport-search-modal; area-select; toolbar/filter-modal blocks.

---

### ✅ Sprint chen — Dashboard Shell (CRM SaaS layout) — **DONE** (2026-06-05)

**Vì:** CRM Coach + Admin nên là layout SaaS riêng (sidebar + topbar), KHÔNG dùng Header/Footer site; vào từ user dropdown main header.

- `lib/dashboard-routes.ts` → `isDashboardRoute(pathname)`: true cho `/admin/*` + `/coach/*` TRỪ onboarding/verification (giữ chrome site).
- `components/layout/SiteChrome.tsx` (client): root layout bọc → render Header+main+Footer trừ dashboard route.
- `components/layout/DashboardShell.tsx`: sidebar navy + topbar, variant `coach` ("Coach Studio") / `admin` ("Admin Console"), nav AppIcon active longest-prefix, user mini + "Về trang chủ".
- `app/coach/layout.tsx` (conditional) + `app/admin/layout.tsx`. SCSS `blocks/_dash-shell.scss` (neutralize `.coach-cms` trong shell). Header dropdown + mobile menu thêm Booking + Duyệt HLV.
- **Convention §14c.** Verified Chrome cả 2 variant.

---

### 🔴 Tuần 6 — Coach Operations + Admin (H5 + H6)

**Output:** Coach confirm booking real-time, Admin duyệt coach.

**Routes:**
- `/coach/bookings` — tabs Chờ xác nhận (badge) / Sắp tới / Đã hoàn thành
- `/admin` — sidebar, stats today GMV/bookings/signups/pending, graph 30d
- `/admin/reviews` — table 3 pending Tầng 1 + 1 Tầng 2, SLA countdown, drawer right với full profile + checklist 7 tiêu chí + Approve/Reject/Request Edit

**Multi-role:** Header switcher đã có sẵn (tuần 1), tuần này verify swap context Linh ↔ Khoa hoạt động đầy đủ.

---

### 🟡 Tuần 7 — Communication + Polish (Communication ✅ DONE 2026-06-05)

**Output:** Chat 2 chiều, notifications, review form. ✅ 3 phần Communication đã build + verified Chrome (persona Linh). Polish còn lại (404, empty states sweep) → cuốn vào Tuần 8.

**Đã build (2026-06-05):**
- **`/messages` + `/messages/[threadId]`** (`features/messages/MessagesClient.tsx`): 2-pane (list + khung chat), mobile ẩn list khi mở thread + nút back. Bubble me/them, timestamp, typing indicator. Gửi tin optimistic → auto-reply 2s (`POST /messages/threads/:id/auto-reply`, bot xoay 5 câu). Content filter `detectPii()` chặn gửi SĐT/link/Zalo + warning đỏ. Mock `chats.mock.ts` (3 thread persona Linh: Coach Khoa verified, Coach Hoà, Trợ lý CoHub). Service `message.service.ts`. Routes `messages`/`messageThread`. Learner-facing → site chrome.
- **`/notifications` + bell dropdown** (`features/notifications/NotificationsClient.tsx` + `components/layout/NotificationBell.tsx`): bell ở header (badge unread, 5 gần nhất, click→mark read+điều hướng), trang full filter theo type + "Đánh dấu tất cả đã đọc". Mock `notifications.mock.ts` (per persona: Linh 8 / Khoa 6 / Admin 4). Service `notification.service.ts`. Route `notifications`. Icon `bell`/`chat` thêm vào AppIcon.
- **Review modal** (`features/booking/ReviewModal.tsx`, createPortal): nút "Đánh giá" trên booking completed ở `/my/bookings` → modal 1-5 sao + 6 tag chips + comment + double-blind hint 7 ngày. Submit → `POST /reviews` (set `visibleAt = +7d`), badge "Đã đánh giá". Types `CreateReviewInput` + `REVIEW_TAGS`.
- Header dropdown + mobile menu thêm Tin nhắn + Thông báo.

**Lưu ý bug đã fix:** `aliveRef` pattern phải set `true` trong mount effect (`useEffect(() => { ref.current = true; return () => { ref.current = false } }, [])`) — nếu không, StrictMode mount→unmount→remount để ref = false vĩnh viễn → state update bị nuốt (skeleton kẹt).

**Spec gốc (tham khảo):**

**Routes:**
- `/messages` — thread list sidebar + main pane
- `/messages/[thread_id]` — bubble UI, input attach, auto-reply bot 2s với 5 câu pre-canned
- `/notifications` — full page list + filter, bell icon dropdown header 5 notif gần nhất + badge unread

**Chat features:**
- Content filter regex SDT VN / Zalo/Telegram/Messenger link → warning đỏ "Không chia sẻ thông tin liên hệ ngoài Cohub" (PRD A2). **Reuse `detectPii()` đã có** từ tuần 4 (`lib/onboarding-draft.ts` / hoặc tách ra `lib/pii.ts`).
- Icon: thêm `bell` vào `AppIcon` MAP (no-emoji §14b).

**Review:**
- Form modal trong /my/bookings sau completed (1-5 sao + comment + tags)
- Double-blind 7 ngày (UI hint, không cần logic phức tạp)

**Polish:**
- 404 page custom
- Empty states cho mọi list rỗng
- Loading skeleton cho tất cả async fetch

---

### ✅ Tuần 8 — Polish + Quality + Docs — DONE (2026-06-05; deploy đã xong ngoài plan)

> Deploy đã được thực hiện riêng → KHÔNG nằm trong scope plan nữa.

**Đã làm:**
- **A11y:** xác nhận `:focus-visible` ring toàn cục đã có (`globals.scss`) + `prefers-reduced-motion`. ARIA/label/role đầy đủ. Fix alt rỗng ở `MyCoursesClient` cover image. Audit (subagent): empty states + skeleton đã 100% coverage mọi async list, không thiếu.
- **404:** `app/not-found.tsx` đã có (verified Chrome) — icon + title + CTA về home/tìm HLV, dùng site chrome.
- **Responsive:** width cứng đều dùng `min()`/media query; `_responsive.scss` có util `.hide-mobile`, safe-area, scroll-snap.
- **Docs:** `README.md` (viết lại — setup, env, cấu trúc, personas, Demo Mode), `DEMO_SCRIPT.md` (storyboard 10 phút theo persona), `src/mocks/README.md` (spec mock layer + bảng endpoint).

**Polish (FSD §7):**
- 404 page custom (đã có `app/not-found.tsx`)
- Empty states cho mọi list rỗng (đã 100% coverage)
- Loading skeleton cho async fetch (đã đủ)

**Quality (FSD §8):**
- Accessibility: Tab navigate, **`:focus-visible` ring toàn cục**, ARIA, alt text, contrast ≥4.5:1
- Responsive: 360 / 768 / 1024 / 1440px — verify không tràn/overlap
- Cross-browser: Chrome / Safari / Firefox / Edge (manual)

**Docs (deliverables cuối):**
- `DEMO_SCRIPT.md` — investor storyboard 10 phút theo persona (FSD §6)
- `README.md` — setup + Demo Mode docs
- `src/mocks/README.md` — mock data spec

**Demo Mode (FSD §5) — để lại, không bắt buộc cho MVP demo:**
- Time travel, trigger events, verify investor 5× (đã có khung trong DemoModeContext)

---

## 4. Mock Data Roadmap

### Personas (đã có)

| Persona | User | State preload |
|---|---|---|
| **guest** | null | — visitor lần đầu |
| **linh** | Trần Thu Linh (u_linh) | 1 booking upcoming + 2 completed, 1 course IN_PROGRESS, 1 chat thread |
| **khoa** | Nguyễn Văn An (u_khoa) | Coach Verified, 23 buổi/tháng, 2 booking pending, 1 course active |
| **admin** | Admin Trần (u_admin) | 3 profile pending Tầng 1, 1 verification Tầng 2 |

### Cần expand cho tuần 2-7

| File mock | Mục tiêu | Tuần | Trạng thái |
|---|---|---|---|
| `bookings.mock.ts` | Sinh booking đầy đủ cho 3 persona, status đa dạng + custom request | 2 | ✅ |
| `payment.mock.ts` | Fake gateway response, force-fail toggle | 2 | ✅ |
| `promo.mock.ts` | `DEMO50`, `INVALID` | 2 | ✅ |
| `courses.mock.ts` | **50 course** (13 template, 8 FIXED + flexible) | 3 | ✅ (vượt mục tiêu 12) |
| `coaches.mock.ts` | **50 coach** (8 literal + 42 generated) | — | ✅ (vượt mục tiêu 8) |
| `openSession.mock.ts` | Lịch dạy mở + recurring expansion | sprint | ✅ |
| `dashboard.mock.ts` | Coach dashboard stats persona Khoa | 5 | ✅ |
| `admin.mock.ts` (≈ admin-queue) | 4 hồ sơ duyệt (3 Tier1 + 1 Tier2) | 6 | ✅ |
| `chats.mock.ts` | 3 thread persona Linh (Khoa/Hoà/Bot) + auto-reply | 7 | ✅ |
| `notifications.mock.ts` | per persona (Linh 8 / Khoa 6 / Admin 4) | 7 | ✅ |

---

## 5. Conventions cần tuân thủ

> Tránh rework giữa tuần.

1. **Mock-API swap rule:** Component KHÔNG import `mocks/`. Chỉ import qua `services/`.
2. **Route từ config:** Không hardcode `/coaches`. Dùng `ROUTES.coaches` từ `@config/routes`.
3. **Path alias** đầy đủ — không relative imports xuyên feature.
4. **`'use client'`** chỉ khi cần hook / event / browser API / Swiper / Framer Motion.
5. **DTO shape match BE** — mock data dùng cùng tên field BE sẽ trả (snake_case nếu BE snake_case).
6. **framer-motion pin v11.x** — v12 break bundler.
7. **Date** dùng `@lib/date.ts` (dayjs vi locale), không tự format.
8. **Form** dùng `react-hook-form + zod`, không state thủ công cho multi-step.
9. **Toast** dùng `useToast()`, không alert/console.
10. **Loading** dùng `Skeleton*`, không spinner trừ button hành động.

---

## 6. Open Decisions (cần chốt khi gặp)

| # | Quyết định | Khi nào cần |
|---|---|---|
| Q1 | Investor có cần Stripe test mode payment "thật-ish" hay fake hoàn toàn đủ? | Tuần 2 trước build /checkout |
| Q3 | User testing có record screen (Hotjar/OBS)? Cần consent form? | Trước test |
| Q4 | Mobile responsive đủ hay cần native preview? | Tuần 8 polish |
| Q5 | Cover image fake nào — Unsplash CDN URL hay download host static? | Tuần 3 (course cover) |
| Q6 | Coach Khoa dual-role: default vào với role `coach` hay `user`? | Đã chốt: `coach` (file persona.mock.ts) |

---

## 7. Hot Tasks tiếp theo

> Khi bắt đầu session mới, đọc section này trước.

**Đang ở:** **MVP 8 tuần FEATURE-COMPLETE** (2026-06-05). Tuần 7 Communication + Tuần 8 Polish/Docs đã xong; deploy đã thực hiện ngoài plan. Trước đó: tuần 1–6 + 2 sprint chen (Booking V2 Hybrid/UI overhaul, Dashboard Shell). Build pass (tsc/lint/sass), verified Chrome. Docs: README, DEMO_SCRIPT, mocks/README.

**Reconciliation 2026-06-05 (tránh conflict plan ↔ code):**
- §2.1 pages: `/coaches` đã redesign (toolbar+modal, no sidebar, grid 3col), coach detail booking panel tối giản + CoachBookingModal calendar, thêm `/courses`, `/coach/*` + `/admin/*` dùng Dashboard Shell.
- §2.3: mock 50 coach / 50 course / 14 file; thêm `area-match.ts`, `dashboard-routes.ts`.
- §4: admin-queue = `admin.mock.ts` ✅, coaches/courses vượt mục tiêu ✅. Còn lại Tuần 7: `chats.mock.ts`, `notifications.mock.ts`.
- §14b no-emoji + §14c dashboard shell đã vào CODING_CONVENTION.md.
- Custom booking dùng `isCustomRequest` flag + status `pending` (KHÔNG field `PENDING_COACH`/`estimatedPrice`).

**Đã build tuần 6 (H5 + H6):**
- H5 `/coach/bookings` (`CoachBookingsClient`): inbox booking coach nhận từ học viên, tab Chờ xác nhận (badge)/Sắp tới/Đã hoàn thành. Confirm = optimistic + toast. Decline = dialog (`.cms-dialog`) + lý do dropdown + cảnh báo "giảm 1 điểm uy tín, hoàn 100%". `BookingListQuery` thêm `coachId`; `Booking` thêm `userName` (denormLearner). coachId='c1' (persona Khoa).
- H6 `/admin` (`AdminDashboardClient`): 4 stat card + CTA queue. `/admin/reviews` (`AdminReviewsClient`): queue sort theo SLA, badge tier (Hồ sơ cơ bản/Xác minh KYC), SLA countdown đỏ khi <6h; drawer phải (`.admin-drawer`) = profile + chứng chỉ + checklist 7 tiêu chí + Duyệt/Từ chối/Yêu cầu sửa. Mock mới `admin.mock.ts` (4 hồ sơ: 3 Tier1 + 1 Tier2) + `admin.service.ts` + `types/admin.ts`. Route `ROUTES.adminReviews`. Guard role admin (switch persona Admin qua Demo panel).

**Đã build tuần 5:**

**Đã build tuần 5:**
- Types: `CoachDashboardStats`, `RevenuePoint`, `RecentBookingItem`, `InboxThreadPreview`, `CoachDashboard`
- Mock: `dashboard.mock.ts` cho persona Khoa — GMV 24.75tr/tháng (+18%), 23 buổi (+12%), 7 học viên mới (+40%), rating 4.9, revenue 30d trend tăng 3.5%/day, 5 recent bookings, 3 inbox threads (2 unread)
- Service: `dashboardService.coachOverview()`
- Routes mới: `ROUTES.coachDashboard / coachCourses / coachCourseNew / coachCalendar / coachBookings`
- Routes update: `coachCms` redirect `/coach/dashboard` (legacy `/coach-cms` redirect sang)
- Components:
  - `CoachDashboardClient` — banner welcome, 4 stat cards với delta %, **Recharts AreaChart 30d** với gradient + tooltip VND, recent bookings table 5 dòng với badge status, inbox preview 3 thread (unread dot xanh)
  - `CoachCoursesClient` — grid auto-fill 280px, `CoachCourseCard` với status badge (published/full/started), enrollment count
  - `CourseCreateWizard` 5 bước — Step1 ScheduleType (FIXED/FLEXIBLE visual cards), Step2 Info (title + sport + level chips + description 50-2000), Step3 Schedule (sessions + duration chips + startDate + weekday toggle hoặc flexible validity), Step4 Price (commission preview "Bạn nhận 1.275.000đ" + maxParticipants chips), Step5 Cover (file upload + course-card preview)
  - `CoachCalendarClient` — toolbar nav tuần trước/sau, view toggle Tuần/Tháng (Month disabled v1), grid 8-col × 7-row time slots, slot color code (available/booked/blocked/course/past), click slot → toggle blocked với toast
- SCSS `_coach-cms.scss` (~570 dòng): `.coach-cms`, `.cms-banner`, `.cms-stats`, `.cms-stat`, `.cms-card`, `.cms-chart`, `.cms-grid-2`, `.cms-table`, `.cms-badge`, `.cms-inbox`, `.cms-course-list/card`, `.cms-calendar`, `.cms-calendar-toolbar`
- Recharts installed

**Đã build tuần 4:**
- Types: `CoachOnboardingDraft` với 5 partial step, `OnboardingStatus` state machine (signed_up → profile_draft → pending_basic_review → active_unverified → pending_verification → active_verified), `PiiDetection`
- Lib: `onboarding-draft.ts` localStorage CRUD + `detectPii()` regex VN phone/URL/Zalo|Telegram|Messenger
- Service: `onboardingService.submitBasicReview` + `submitVerification` (mock auto-pass với withDelay)
- Routes mới: `/become-coach` (landing pitch), `/coach/onboarding` (wizard 5 bước), `/coach/onboarding/preview`, `/coach/verification` (Tier 2 KYC + cert)
- Components mới:
  - `Stepper` (UI lib) — 5 dot horizontal, clickable nếu đã visit
  - `OnboardingWizard` — orchestrator với auto-save 5s, validate per-step, save draft, redirect preview
  - 5 step component: `Step1Basic` (avatar + name + gender + birth year + city chips), `Step2Expertise` (sport multi-select max 3, exp years, 4-level radio cards, audience tags), `Step3Bio` (tagline 10-80 + bio 100-1500 + AntiPII inline warning + approach/achievements/video + portfolio 8 ảnh), `Step4Area` (district max 5 grouped by city, format multi-checkbox), `Step5Price` (price60 + 90 + group, day-of-week toggle, commission preview)
  - `OnboardingPreview` — render profile như learner thấy + submit button với 4 stage (preview/submitting/pending/approved), auto-redirect dashboard sau 5s (withDelay)
  - `CoachVerificationClient` — 3 KYC slots (CCCD front/back + selfie) + cert list max 10 + eKYC progress 3-step (OCR → Face match → Cross-check)
- Legacy `/register/coach` redirect sang `/become-coach`

**Đã build Tuần 7 — Communication (2026-06-05, verified Chrome persona Linh):**
- `/messages` + `/messages/[threadId]` chat 2 chiều + auto-reply 2s + PII filter (chặn gửi SĐT/link/Zalo).
- `/notifications` + bell dropdown header (badge unread, mark read, filter theo type).
- Review modal sau buổi completed (`/my/bookings`): sao + tag + comment + double-blind 7 ngày → badge "Đã đánh giá".
- Mock mới: `chats.mock.ts`, `notifications.mock.ts`; POST /reviews. Routes `messages`/`messageThread`/`notifications`. Icon `bell`/`chat` vào AppIcon.

**Next session làm gì → Tuần 8 (Polish + Docs; deploy đã xong ngoài plan):**
1. Mở `PLAN.md`, chạy `npx tsc --noEmit && npx next lint` confirm clean.
2. A11y: `:focus-visible` ring toàn cục, fix alt text, kiểm contrast.
3. Responsive verify 360/768/1024/1440 — fix tràn/overlap nếu có.
4. Docs: `DEMO_SCRIPT.md`, `README.md`, `src/mocks/README.md`.
(Demo Mode time-travel/trigger events: optional, để lại nếu cần.)

**Trigger câu lệnh đề xuất:** "tiếp tục tuần 8"

**Lưu ý khi build Tuần 7 (đã reconcile):**
- `/messages`, `/notifications` là route **learner-facing** → dùng site chrome (KHÔNG dashboard shell). Nếu muốn coach cũng có inbox trong CRM thì thêm route `/coach/*` riêng sau.
- Routes `messages`/`messageThread`/`notifications` CHƯA có trong `ROUTES` → thêm vào `config/routes.ts`.
- Chưa có sẵn bell/dropdown/thread component → build mới; tái dùng pattern modal + `useToast`.

---

## 8. Glossary

- **Persona:** user mock preset (Linh/Khoa/Admin/guest) — switch nhanh qua Demo panel
- **Demo Mode:** panel ẩn (Ctrl+Shift+D) chứa toggles + persona switcher
- **Investor mode:** chế độ trong Demo Mode → accelerate delay 5× (5s → 1s) + disable error
- **withDelay(ms):** helper trong `useDemoMode()` — apply investor/slowNetwork tăng/giảm time
- **requireLogin(redirect):** hook `useAuth` đẩy về `/auth/login?next=...` nếu chưa login
- **ROUTES:** single source of truth route paths — `src/config/routes.ts`
- **mockRegistry:** map `'METHOD /path' → handler({pathParams, query, body})` — service layer pattern
- **FSD §X:** Functional Spec Document section X — tra trong `/FSD_Cohub_Sport_MVP_Frontend.md`

---

**Last updated:** 2026-06-05 (tuần 8 Polish + Docs done — a11y/responsive/404 + README/DEMO_SCRIPT/mocks README. MVP 8 tuần hoàn tất; deploy đã xong ngoài plan.)
**Next milestone:** Không còn milestone bắt buộc — MVP feature-complete. Tùy chọn: Demo Mode time-travel/trigger events, hoặc ghép backend thật (`DATA_SOURCE=api`).
