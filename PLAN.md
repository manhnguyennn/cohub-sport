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
| **Deploy** | **Netlify** (không phải Vercel như FSD đề xuất) |
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
| **H5** Coach inbox booking → Confirm | Coach ops | 🔴 0% | 6 |
| **H6** Admin queue → Approve coach | Admin quality control | 🔴 0% | 6 |
| **Polish + Deploy** | a11y, perf, demo script, Netlify | 🔴 0% | 7-8 |

---

## 2. Trạng thái codebase hiện tại

### 2.1 Pages đã build

| Route | Mô tả | Trạng thái |
|---|---|---|
| `/` | Home — port từ Features page CRA, 12 sections refactored | ✅ |
| `/coaches` | Search & filter coach list (URL state) | ✅ |
| `/coaches/[id]` | Coach Profile Detail (tabs, sidebar booking panel, similar, FAQ, CTA) | ✅ |
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
- `src/lib/mockRegistry.ts` — pattern `registerMock('GET /coaches', handler)`, support `:param`
- Services: `coach.service.ts`, `sport.service.ts`, `review.service.ts`, `booking.service.ts`, `auth.service.ts`
- Mocks: `coaches.mock.ts` (8 coach), `sports.mock.ts` (17 sport), `reviews.mock.ts`, `bookings.mock.ts`, `auth.mock.ts`, `personas.mock.ts`

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
- Submit → status `PENDING_BASIC_REVIEW` → 5s background → auto-approve → notification "🎉 Profile online!" → redirect dashboard
- Investor mode tăng tốc 5s → 1s (theo `withDelay()`)

---

### 🔴 Tuần 5 — Coach Dashboard + Course Manager (H4 complete)

**Output:** Coach Khoa có dashboard data đẹp, tạo course mới, manage calendar.

**Routes:**
- `/coach/dashboard` — banner "🎉 Profile online!", 4 stat cards, graph revenue 30d (Recharts), recent bookings 5 dòng, inbox preview 3 chat
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

### 🔴 Tuần 6 — Coach Operations + Admin (H5 + H6)

**Output:** Coach confirm booking real-time, Admin duyệt coach.

**Routes:**
- `/coach/bookings` — tabs Chờ xác nhận (badge) / Sắp tới / Đã hoàn thành
- `/admin` — sidebar, stats today GMV/bookings/signups/pending, graph 30d
- `/admin/reviews` — table 3 pending Tầng 1 + 1 Tầng 2, SLA countdown, drawer right với full profile + checklist 7 tiêu chí + Approve/Reject/Request Edit

**Multi-role:** Header switcher đã có sẵn (tuần 1), tuần này verify swap context Linh ↔ Khoa hoạt động đầy đủ.

---

### 🔴 Tuần 7 — Communication + Polish

**Output:** Chat 2 chiều, notifications, review form.

**Routes:**
- `/messages` — thread list sidebar + main pane
- `/messages/[thread_id]` — bubble UI, input attach, auto-reply bot 2s với 5 câu pre-canned
- `/notifications` — full page list + filter, bell icon dropdown header 5 notif gần nhất + badge unread

**Chat features:**
- Content filter regex SDT VN / Zalo/Telegram/Messenger link → warning đỏ "Không chia sẻ thông tin liên hệ ngoài Cohub" (PRD A2)

**Review:**
- Form modal trong /my/bookings sau completed (1-5 sao + comment + tags)
- Double-blind 7 ngày (UI hint, không cần logic phức tạp)

**Polish:**
- 404 page custom
- Empty states cho mọi list rỗng
- Loading skeleton cho tất cả async fetch

---

### 🔴 Tuần 8 — Quality bar + Deploy

**Quality (FSD §8):**
- Performance: Lighthouse ≥ 85, LCP ≤ 2.5s desktop
- Accessibility: Tab navigate, ARIA, contrast ≥4.5:1
- Cross-browser: Chrome / Safari / Firefox / Edge
- Responsive: 360 / 768 / 1024 / 1440px

**Demo Mode complete (FSD §5):**
- Time travel (set time = T-1h before booking)
- Investor mode toggle (đã có) — verify accelerate 5× hoạt động
- Trigger events: "Trigger booking notification", "Auto-approve pending reviews"

**Investor demo script** (FSD §6) — 10 phút storyboard, mỗi phút ứng với scene.

**Deploy Netlify:**
- `netlify.toml` config Next.js plugin
- Preview branch tự động cho mỗi PR
- 3 demo accounts preset (Linh / Khoa / Admin) — skip signup

**Deliverables cuối:**
- Live URL Netlify
- README setup + Demo Mode docs
- Mock data spec `mocks/README.md`
- 5-min investor demo video (record screen backup)

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

| File mock | Mục tiêu | Tuần |
|---|---|---|
| `bookings.mock.ts` | Sinh booking đầy đủ cho 3 persona, status đa dạng | 2 |
| `payment.mock.ts` | Fake gateway response, force-fail toggle | 2 |
| `promo.mock.ts` | `DEMO50`, `INVALID` | 2 |
| `courses.mock.ts` (mới) | 12 course standalone (8 FIXED + 4 FLEXIBLE) | 3 |
| `enrollments.mock.ts` (mới) | Enrollment cho persona Linh | 3 |
| `chats.mock.ts` (mới) | 3 thread cho persona Linh, 1 thread auto-reply bot | 7 |
| `notifications.mock.ts` (mới) | 8-12 notif per persona | 7 |
| `admin-queue.mock.ts` (mới) | Pending review Tầng 1/2 cho persona Admin | 6 |

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
| Q2 | Demo cho investor: offline backup video hay chỉ online Netlify? | Tuần 8 |
| Q3 | User testing có record screen (Hotjar/OBS)? Cần consent form? | Trước test |
| Q4 | Mobile responsive đủ hay cần native preview? | Tuần 8 polish |
| Q5 | Cover image fake nào — Unsplash CDN URL hay download host static? | Tuần 3 (course cover) |
| Q6 | Coach Khoa dual-role: default vào với role `coach` hay `user`? | Đã chốt: `coach` (file persona.mock.ts) |

---

## 7. Hot Tasks tiếp theo

> Khi bắt đầu session mới, đọc section này trước.

**Đang ở:** Cuối tuần 5 — H4 Coach CMS (dashboard + courses + course wizard + calendar) complete, build pass.

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

**Next session làm gì:**
1. Mở `PLAN.md` này
2. Chạy `npx tsc --noEmit && npx next lint` để confirm clean baseline
3. Bắt đầu **Tuần 6 — Coach Operations + Admin (H5 + H6)** theo §3 tuần 6
4. Task #1 sẽ build: `/coach/bookings` inbox với tabs Chờ xác nhận / Sắp tới / Đã hoàn thành

**Trigger câu lệnh đề xuất:** "tiếp tục tuần 6"

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

**Last updated:** 2026-06-02 (tuần 5 done)
**Next milestone:** Tuần 6 — H5 Coach Operations (/coach/bookings inbox) + H6 Admin (/admin dashboard + /admin/reviews queue)
