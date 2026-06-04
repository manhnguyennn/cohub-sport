# 🧠 CoHub Sport — Knowledge Base

> **Mục đích file này:** Mỗi chat mới với Claude bắt đầu, mở file này → nắm trọn context không cần giải thích lại.
> **Cập nhật lần cuối:** 2026-06-04 (sau sprint "Lịch dạy mở")
> **Maintainer:** Manh (manhngxn.io@gmail.com)

---

## 1. Sản phẩm là gì

**CoHub Sport** — marketplace 2 mặt kết nối **học viên Việt Nam** với **HLV thể thao** (Pickleball, Yoga, Gym, Tennis, Bơi, Pilates...). Web App MVP để (a) demo investor, (b) user testing 20-30 người.

**Đặc thù VN:** UI/UX/copy Vietnamese-first, payment VNPay/MoMo/ZaloPay (mock), TP.HCM + Hà Nội + Đà Nẵng làm thị trường thử nghiệm.

**Repo:** `/Users/manhnguyen/Documents/work/cohub-main/cohub-next/` (Next.js project bên trong cohub-main repo).

**Source of truth (đặt ở cohub-main, ngoài cohub-next):**
- `PRD_Cohub_Sport.md` — vision + scope
- `FSD_Cohub_Sport_MVP_Frontend.md` — blueprint trang/component (đọc trước nếu chưa rõ section nào)
- `SRS_Cohub_Sport.md` — NFR, compliance
- `PRD_Cohub_Sport_DetailFlow_Coach_Onboarding.md` — flow O0-O9
- `PRD_Cohub_Sport_DetailFlow_Booking_Course.md` — flow A1-A7 + B1-B6
- `UX_Writing_Guide_Cohub_Sport.md` — guide tiếng Việt cho copy

---

## 2. Tech Stack (đã chốt — không bàn lại)

| Layer | Chọn | Tại sao |
|---|---|---|
| Framework | **Next.js 14 App Router** | RSC + file routing |
| Language | **TypeScript strict** | Tránh runtime bug ở mock layer |
| Styling | **SCSS + design tokens v2** | BEM, file `_*.scss` per block, import qua `globals.scss` |
| State | **React Context + manual localStorage** | KHÔNG Zustand — đã thử và quyết bỏ vì over-engineer cho scope MVP |
| Data | **Mock registry → apiClient** | Single switch `isMock`, swap BE chỉ đổi env flag |
| Date | **dayjs + locale vi** | Wrapper ở `@lib/date.ts` |
| Form | **react-hook-form + zod** | Multi-step wizard |
| Charts | **Recharts** | Coach dashboard tuần 5 |
| Animation | **framer-motion v11.18.2 pin** | v12 break bundler — KHÔNG nâng |
| Deploy | **Netlify** | Đã chốt thay Vercel |

**Versions từ package.json:** Next 14.2.15 · React 18.3.1 · TypeScript 5.5.3 · sass 1.90 · dayjs 1.11.21 · recharts 3.8.1 · zod 3.25.76.

---

## 3. Domain Model — 3 khái niệm booking phải tách rõ

**Quan trọng nhất** — user đã correct concept này 1 lần và muốn không gộp lại:

### 3.1 Khoá học (Course)
Gói nhiều buổi (FIXED hoặc FLEXIBLE), 1 giá trọn gói. Học viên đăng ký 1 lần.
- Type: `Course` (`src/types/course.ts`)
- Routes: `/courses`, `/courses/[id]`, `/courses/[id]/enroll`, `/my/courses`
- Coach tạo: `/coach/courses/new` (CourseCreateWizard 5 bước)
- Coach quản: `/coach/courses`

### 3.2 Lịch dạy mở (OpenSession) — **MỚI, sprint chen sau tuần 5**
Từng buổi tập cụ thể coach đăng trước với **ngày-giờ + giá riêng** + sĩ số. Học viên xem catalog & book trực tiếp. **Đã thay thế** custom slot picker cũ.
- Type: `OpenSession` (`src/types/openSession.ts`) — status: open/full/cancelled/completed
- Mock: `openSession.mock.ts` (8 sessions cho Khoa + 3 cho Hoà)
- Service: `openSessionService.list/getById/create/createRecurring/cancel/book`
- Routes learner: `/coaches/[id]#open-sessions` → `/booking/session/[id]`
- Routes coach: `/coach/sessions`, `/coach/sessions/new`
- Wizard 3 bước: **Đơn lẻ** vs **Lặp lại theo tuần** (T2+T4+T6 trong 4 tuần → auto sinh 12 sessions)

### 3.3 Lịch trống (TimeSlot / Availability)
Chỉ là marker "tôi rảnh giờ này" — internal, không bán trực tiếp.
- Quản lý ở `/coach/calendar` (Week view 8 cols × 7 time slots)
- Slot states: available · booked · blocked · course · open-session · open-full · past

**Quy tắc:** Khi đề cập booking/course/lịch — luôn check đang nói concept nào. Đừng gộp Lịch dạy mở với Khoá học.

**Flow booking học viên đã chốt:**
1. `/coaches/[id]` → section "Lịch dạy mở" → click "Đặt buổi này"
2. → `/booking/session/[id]` (BookingSessionForm — slot read-only, chỉ điền note+health+promo)
3. → `/checkout` (FakePaymentModal VNPay/MoMo/ZaloPay)
4. → `bookingService.create` + `openSessionService.book(id)` bump bookedCount
5. → `/booking/[id]?status=success`

Legacy `/booking/new?coachId=...` → redirect `/coaches/[slug]#open-sessions`.

---

## 4. UX Writing — Tiếng Việt convention

| Concept | Term | Tránh |
|---|---|---|
| Khoá học (gói) | "Khoá học" / "Tạo khoá học" | "Course package" |
| Lịch dạy mở | "Lịch dạy mở" / "Mở lịch dạy mới" / "Buổi tập" | "Slot", "Session" trong UI |
| Block lịch trống | "Block", "Mở lại slot" | "Disable" |
| Học viên | "Học viên" / "Bạn" | "User" |
| HLV | "HLV" / "Coach" | "Trainer", "Instructor" |
| Đặt buổi | "Đặt buổi này" / "Đặt lịch" | "Book now" |
| Sĩ số | "1-1" (cá nhân) / "Nhóm N người" | "Capacity" |
| Đánh giá | "Đánh giá" (sao) | "Review" |
| Tin nhắn | "Tin nhắn" / "Chat" | "Message" |

**Voice:** Thân thiện, không cứng/formal quá. Tránh emoji trong copy chính (chỉ dùng ở banner/icon nhấn). Câu khẳng định ngắn gọn. Số tiền: `1.500.000 đ` (chấm phẩy VN, có space + chữ đ thường).

---

## 5. Personas (4 + 1 dual-role)

| Persona | User | State preload |
|---|---|---|
| **guest** | null | — visitor lần đầu, chưa login |
| **linh** (Trần Thu Linh — u_linh) | role=`user` | 1 booking upcoming + 2 completed, 1 course IN_PROGRESS, 1 chat thread |
| **khoa** (Nguyễn Văn An — u_khoa, dual-role) | default=`coach`, có thể switch `user` | Coach Verified `c1`, 23 buổi/tháng, 2 booking pending nhận từ Linh, 8+ OpenSession mở, 4 courses active |
| **admin** (Admin Trần — u_admin) | role=`admin` | 3 profile coach pending Tầng 1, 1 verification Tầng 2 |

**Switch persona:** `Ctrl+Shift+D` → Demo Mode panel → click 1 trong 4. Persona persist localStorage `cohub:persona`.

**Coach Khoa = c1** (mock map cố định trong các file CoachDashboardClient/CoachCalendarClient/CoachSessionsClient).

---

## 6. Folder Structure

```
cohub-next/
├── PLAN.md                       # Roadmap 8 tuần — đọc đầu chat để biết đang tuần nào
├── KNOWLEDGE.md                  # ← FILE NÀY
├── src/
│   ├── app/                      # Next App Router pages
│   │   ├── coaches/[id]/         # Coach detail
│   │   ├── courses/[id]/enroll/  # Course enrollment
│   │   ├── booking/session/[id]/ # ← Booking từ Lịch dạy mở (mới)
│   │   ├── booking/new/          # ← Legacy redirect
│   │   ├── coach/dashboard|courses|calendar|sessions|onboarding|verification|bookings/
│   │   ├── checkout/, my/bookings, my/courses/
│   │   ├── auth/login|signup|otp, become-coach, admin/
│   │   ├── layout.tsx            # ← import '@mocks/index' SERVER
│   │   └── globals.scss
│   │
│   ├── components/
│   │   ├── ui/                   # Button, Input, Card, Stepper, MobileStickyBar, EmptyState, Skeleton...
│   │   ├── layout/Header.tsx     # Main header + mobile menu + user dropdown
│   │   ├── demo/DemoModePanel.tsx
│   │   └── providers/AppProviders.tsx   # ← import '@mocks/index' CLIENT
│   │
│   ├── features/                 # Page-level composition
│   │   ├── home/, coaches/, courses/, booking/, auth/, onboarding/
│   │   └── coach-cms/            # ← CoachDashboardClient, CoachSessionsClient, OpenSessionCreateWizard...
│   │
│   ├── services/                 # apiClient adapters per domain
│   ├── mocks/                    # registerMock() per domain — phải import qua mocks/index.ts
│   ├── types/                    # Plain TS types per domain
│   ├── lib/                      # date, cn, format, apiClient, mockRegistry, booking-draft, onboarding-draft, persona-storage
│   ├── hooks/                    # useAuth, useDebounce, ...
│   ├── contexts/                 # PersonaContext, ToastContext, DemoModeContext
│   ├── config/                   # env, routes
│   └── styles/
│       ├── _tokens.scss          # CSS vars + SCSS vars (color/type/spacing/radius/shadow)
│       ├── _feature.scss         # Legacy Home sections (đã refactor)
│       ├── globals.scss          # Import order quan trọng
│       └── blocks/               # 25+ files BEM blocks
```

---

## 7. Path Aliases (`tsconfig.json`)

```ts
"@/*":          "./src/*"
"@app/*":       "./src/app/*"
"@components/*": "./src/components/*"
"@features/*":  "./src/features/*"
"@services/*":  "./src/services/*"
"@lib/*":       "./src/lib/*"
"@hooks/*":     "./src/hooks/*"
"@app-types/*": "./src/types/*"        // ⚠ KHÔNG phải @types/ (đụng @types/node)
"@mocks/*":     "./src/mocks/*"
"@styles/*":    "./src/styles/*"
"@config/*":    "./src/config/*"
"@contexts/*":  "./src/contexts/*"
```

**Quy tắc:** Component KHÔNG import trực tiếp từ `@mocks/`. Chỉ qua `@services/`.

---

## 8. Data Layer — Mock Registry Pattern

**Cơ chế:**
```ts
// 1. Trong src/mocks/openSession.mock.ts
registerMock('GET /open-sessions', ({ query }) => filterSessions(...));
registerMock('POST /open-sessions/:id/book', ({ pathParams }) => {...});

// 2. Trong src/services/openSession.service.ts
export const openSessionService = {
  list: (q) => apiClient.get('/open-sessions', { params: q }),
  book: (id) => apiClient.post(`/open-sessions/${id}/book`),
};

// 3. Component chỉ biết service:
const sessions = await openSessionService.list({ coachId: 'c1' });
```

**Switch BE:** `NEXT_PUBLIC_DATA_SOURCE=mock` (default) → mock; `=api` → fetch thật. Component KHÔNG sửa.

### ⚠ Critical bug đã fix — Mock registry phải có cả ở client bundle
Next.js có 2 bundle (server / client). `@mocks/index` cần import ở **cả 2 chỗ**:
- `src/app/layout.tsx` (server-side)
- `src/components/providers/AppProviders.tsx` `'use client'` — side-effect `import '@mocks/index'`

Nếu thiếu → client components (CoachDashboardClient, MyBookings, CoachSessionsClient...) sẽ throw `"[apiClient/mock] No handler for ..."` ở browser. **Khi thêm mock file mới chỉ cần add vào `src/mocks/index.ts`** — cả 2 bundle tự kéo.

---

## 9. State Management — Context + localStorage

**KHÔNG dùng** Zustand/Redux/Jotai. **Chỉ 3 Context:**

| Context | Hook | Purpose | Persist |
|---|---|---|---|
| `PersonaContext` | `usePersona()` | persona + user + role + login/logout + switchRole | `cohub:persona` |
| `ToastContext` | `useToast()` | `.success() .error() .info() .warning()` | — |
| `DemoModeContext` | `useDemoMode()` | toggles (forcePaymentFail, withDelay...) + `openPanel()` + `Ctrl+Shift+D` hotkey | `cohub:demo` |

**Auth hook:** `useAuth()` đọc PersonaContext, expose: `isReady`, `isLoggedIn`, `user`, `role`, `requireLogin({redirectTo})`, `requireRole('coach')`.

**Pattern guard:**
```tsx
useEffect(() => {
  if (!isReady) return;
  if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.coachSessions }); return; }
  if (role !== 'coach' && role !== 'admin') { router.replace('/'); return; }
  // load data...
}, [isReady, isLoggedIn, role, requireLogin, router]);

if (!isReady || !isLoggedIn) return null;
```

**Storage drafts:** `booking-draft.ts` (sessionStorage `cohub:booking_draft`), `onboarding-draft.ts` (localStorage `cohub:onboarding_draft`).

---

## 10. Routes (`@config/routes`)

Single source of truth. **KHÔNG hardcode `/coaches` ở component.** Helpers cho dynamic: `ROUTES.coachDetail('c1')`, `ROUTES.bookingSession('s_c1_1')`.

**Key routes:**
- Public: `/`, `/coaches`, `/coaches/[id]`, `/courses`, `/courses/[id]`, `/become-coach`
- Auth: `/auth/login`, `/auth/signup`, `/auth/otp`
- Learner: `/booking/session/[id]`, `/checkout`, `/booking/[id]`, `/my/bookings`, `/my/courses`
- Coach CMS: `/coach/dashboard`, `/coach/sessions`, `/coach/sessions/new`, `/coach/courses`, `/coach/courses/new`, `/coach/calendar`, `/coach/bookings` (Tuần 6)
- Coach onboarding: `/coach/onboarding`, `/coach/onboarding/preview`, `/coach/verification`
- Admin: `/admin`, `/admin/reviews` (Tuần 6)
- Legacy redirects: `/coach-cms` → `/coach/dashboard`, `/booking/new?coachId=...` → coach detail #open-sessions

---

## 11. SCSS Conventions

**Tokens trước hết:** `_tokens.scss` declare cả CSS vars (`--brand`, `--bg-elevated`) và SCSS vars (`$radius-card`, `$fw-bold`, `$bp-sm: 640px`, `$bp-md: 768px`, `$bp-lg: 1024px`).

**Mixin breakpoint:**
```scss
@include respond-from(md) { /* ≥ 768px */ }
@include respond-to(md)   { /* < 768px (mobile) */ }
```

**Files import order ở `globals.scss`:**
```scss
@import './tokens';
@import './reset.css';
// base + typography
@import './blocks/header';
@import './blocks/coach-detail';
@import './blocks/coach-open-sessions';   // ← block riêng cho Lịch dạy mở
@import './blocks/coach-cms';             // ← cms-banner, cms-tabs, cms-session-card, cms-quicknav, cms-preview-list...
@import './blocks/booking';                // ← booking-form, +coach-note, +warn
@import './blocks/courses';
@import './blocks/onboarding';
@import './blocks/responsive';
@import './feature';                       // legacy Home, đã refactor
```

**BEM:** Block-Element-Modifier. Ví dụ: `.cms-session-card__head`, `.open-session-card--full`, `.coach-detail .coach-section + .coach-section` (override specificity).

**Mobile-first**: Mặc định mobile, `respond-from(md)` nâng cấp desktop. Tránh `respond-to` trừ khi cần override desktop.

**Touch target ≥ 44px** (WCAG). Sticky bottom CTA bar mobile: `MobileStickyBar` component + `bottom-safe-pad` utility cho iOS notch.

---

## 12. Demo Mode

`Ctrl+Shift+D` hoặc `?demo=1` mở panel. Có:
- **Persona switcher** 4 chip (guest/linh/khoa/admin)
- **Toggles**: forcePaymentFail (fake gateway lỗi), withDelay (slow network simulation), forceLatency 800ms, autoConfirm 3s
- **Reset state** xoá localStorage

**Trong code:** `const { withDelay, toggles } = useDemoMode();` — `withDelay(1500)` trả 1500 hoặc 3000 nếu slow mode bật.

---

## 13. Tiến độ — Đã build & Đang đợi

### ✅ Đã hoàn thành

| Sprint | Output |
|---|---|
| **Tuần 1** Foundation | Personas, Context, Auth hook, Demo Mode, Toast, Skeleton, Stepper |
| **Tuần 2** H1 Booking flow | `/auth/*`, `/booking/new`, `/checkout`, `/booking/[id]`, `/my/bookings`, FakePaymentModal, promo+payment mocks |
| **Tuần 3** H2 Course flow | 12 courses (8 FIXED + 4 FLEXIBLE), `/courses`, `/courses/[id]`, `/courses/[id]/enroll`, `/my/courses` |
| **Tuần 4** H3 Coach onboarding | `/become-coach`, OnboardingWizard 5 step, `/coach/onboarding/preview`, `/coach/verification` |
| **Tuần 5** H4 Coach CMS | `/coach/dashboard` (Recharts AreaChart 30d), `/coach/courses`, `CourseCreateWizard` 5 bước, `/coach/calendar` Week view |
| **Sprint chen** Lịch dạy mở | `OpenSession` type+mock+service, `/coach/sessions` + wizard 3 bước (single/recurring), `CoachOpenSessionsSection` ở `/coaches/[id]`, `/booking/session/[id]`, calendar tích hợp slot màu cam, header coach quick-links |
| **Responsive sprint** | `_responsive.scss`, MobileStickyBar, MobileDrawer, MobileFilterWrapper, header mobile menu full-sheet, mobile-first cho tất cả pages |
| **Coach Detail Figma UI** | Orange theme `#F7EBCF`, big rating card `#FDEACE`, experience timeline, certificate orange cards, short videos 4-col, skill tags |

### 🔴 Đang đợi — Tuần 6 (trigger: "tiếp tục tuần 6")

**H5 Coach Operations:**
- `/coach/bookings` — tabs "Chờ xác nhận" (badge số) / "Sắp tới" / "Đã hoàn thành"
- Drawer/Modal: confirm booking + chat preview + cancel với refund policy

**H6 Admin:**
- `/admin` — sidebar, stats today GMV/bookings/signups/pending, graph 30d
- `/admin/reviews` — table pending Tầng 1 + Tầng 2, SLA countdown, drawer right với profile + checklist 7 tiêu chí + Approve/Reject/Request Edit

### 🔴 Tuần 7-8
- Chat 2 chiều, notifications, review form
- Polish a11y, perf, demo script
- Deploy Netlify

---

## 14. Conventions phải tuân — tránh rework

1. **Mock-API swap:** Component không import `@mocks/`. Chỉ qua `@services/`.
2. **Route từ config:** Không hardcode `/coaches`. Dùng `ROUTES.coaches`.
3. **Path alias** đầy đủ — không relative `../../`.
4. **`'use client'`** chỉ khi cần hook/event/browser API/Swiper/Framer.
5. **DTO shape match BE** — mock data dùng cùng tên field BE sẽ trả.
6. **framer-motion pin v11.x** — v12 break.
7. **Date** dùng `@lib/date.ts` (dayjs vi), không tự format.
8. **Form** dùng `react-hook-form + zod` cho multi-step. Đơn giản dùng `useState`.
9. **Toast** dùng `useToast()`, không `alert()` / `console.log`.
10. **Loading** dùng `Skeleton*`, không spinner trừ button hành động.
11. **`tsc --noEmit`** phải pass trước commit. **`next lint`** phải clean.
12. **Mobile-first**: viết SCSS bắt đầu từ mobile, `respond-from(md)` nâng cấp.
13. **Tap target ≥ 44px** (WCAG).
14. **Khoá học ≠ Lịch dạy mở ≠ Lịch trống** — concept tách rõ.

---

## 15. Common Gotchas (đã debug rồi)

| Bug | Triệu chứng | Fix |
|---|---|---|
| Mock registry empty ở client | Client component throw "No handler" | Import `@mocks/index` ở `AppProviders.tsx` |
| `.coach-section` conflict | Padding-block 80px leak từ Home | Override `.coach-detail .coach-section { padding-block: 0 }` |
| Specificity wars | `padding-top` mất khi có override | Selector `.coach-detail__main > .coach-section + .coach-section` (0,3,0) |
| Header mobile menu auto-open | Default state hiển thị | Bulletproof hide: `visibility:hidden + opacity:0 + pointer-events:none + transform:translateY(-100%)` |
| Mobile menu render thiếu nội dung | `inset` shorthand không enforce | Longhand `top + left + right + bottom + height: calc(100vh - var(--header-h)) + width: 100%` |
| Recharts Tooltip TypeScript error | `formatter: (v: number)` không assignable | Dùng `unknown` rồi coerce: `(v: unknown) => formatVND(Number(v) || 0)` |
| `redirect()` trong try/catch bị nuốt | Next NEXT_REDIRECT throw → catch swallow | Tách `try` lấy data, `redirect()` ngoài try |

---

## 16. Verify checklist khi commit

```bash
cd cohub-next
npx tsc --noEmit          # 0 errors strict
npx next lint             # 0 warnings/errors
# next build: chạy nếu env cho phép (sandbox Cowork build timeout, không bắt buộc)
```

---

## 17. Khi mở chat mới — Quy trình recommended

1. **Mở `KNOWLEDGE.md` này** (file đang đọc) — nắm context tổng
2. **Mở `PLAN.md`** §7 "Hot Tasks tiếp theo" — biết đang ở đâu
3. **Nếu task code:** Bash `cd cohub-next && npx tsc --noEmit && npx next lint` confirm clean baseline
4. **Memory check:** Claude có 3 file memory persist (`cohub-domain-model.md`, `cohub-booking-flow.md`, `cohub-mock-registry-client.md`) — tự load nếu cần

**Trigger phrases user hay dùng:**
- "tiếp tục tuần N" → mở PLAN.md tuần đó, build theo §3
- "implement design Figma <url>" → fetch Figma node, port sang SCSS+TSX
- "responsive cho ..." → mobile-first, tạo block riêng nếu cần
- "mở claude chrome lên check ..." → dùng Chrome DevTools MCP để debug visual

---

## 18. Các quyết định kiến trúc lớn (đã chốt, đừng bàn lại)

| Decision | Rationale |
|---|---|
| Next 14 App Router (không Pages) | Server Components giảm bundle, async page native |
| TypeScript strict | Catch type bugs ở mock layer trước khi swap BE |
| SCSS + BEM (không Tailwind/CSS-in-JS) | Design tokens v2 đã thiết kế chuẩn, BEM dễ debug |
| Context (không Zustand) | Scope MVP nhỏ, Context đủ + persist localStorage tay |
| Mock registry custom (không MSW) | DTO match BE chuẩn, swap chỉ đổi flag, không thêm service worker |
| Recharts (không Chart.js) | TypeScript-friendly, React component-based |
| Netlify (không Vercel) | Đã chốt do business decision |
| Personas mock (không real auth) | Demo investor + user testing không cần real users |
| Lịch dạy mở thay custom slot picker | Coach pre-publish rõ ràng hơn, học viên không tự đề xuất giờ |
| Coach Khoa default role=coach | Dual-role nhưng coach là persona chính |

---

## 19. Liên hệ + Cross-ref

- **PLAN.md** — roadmap 8 tuần
- **CODING_CONVENTION.md** (nếu có) — chi tiết coding rules
- **PRD/FSD/SRS** ở `cohub-main/` parent folder
- **Memory** persistent ở `~/Library/Application Support/Claude/local-agent-mode-sessions/.../memory/`:
  - `cohub-domain-model.md`
  - `cohub-booking-flow.md`
  - `cohub-mock-registry-client.md`

---

**Tóm tắt 1 dòng cho chat mới:**
> CoHub Sport = Next 14 marketplace HLV-học viên VN. 3 concept booking riêng (Khoá học gói / Lịch dạy mở từng buổi có giá riêng / Lịch trống internal). Mock registry switch BE. Context + localStorage state. SCSS BEM mobile-first. Đang đợi Tuần 6 (Coach Operations + Admin).
