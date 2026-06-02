# CoHub — Coding Convention

> Tài liệu này là **nguồn sự thật duy nhất** cho mọi quy ước code trong project `cohub-next`.
> Mọi PR phải tuân thủ. Nếu cần phá vỡ một quy ước → mở Discussion, không tự sửa code rồi update doc sau.

---

## 1. Stack & Versions

| Layer | Tech | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x (strict) |
| UI Library | Material UI | 7.x |
| Styling | SCSS (BEM) + CSS Variables | — |
| Animation | Framer Motion | 12.x |
| Carousel | Swiper | 11.x |
| Linter | ESLint (next/core-web-vitals) | — |
| Formatter | Prettier | — |

**KHÔNG** thêm dependency mới mà không có lý do rõ ràng. Mỗi lib mới phải:
1. Có comment trong PR giải thích "tại sao không tự làm được".
2. Được approve ít nhất 1 reviewer.

---

## 2. Folder Structure

```
cohub-next/
├── public/                    # Static assets (images, fonts, favicon)
│   ├── images/
│   └── fonts/
├── src/
│   ├── app/                   # Next.js App Router — route files only
│   │   ├── layout.tsx         # Root layout (Providers, fonts, Header/Footer)
│   │   ├── page.tsx           # Home (/)
│   │   ├── (marketing)/       # Route group — public marketing pages
│   │   ├── coaches/           # /coaches, /coaches/[id]
│   │   ├── booking/           # /booking/...
│   │   ├── (auth)/            # /login, /register
│   │   ├── coach-cms/         # CMS cho HLV
│   │   ├── admin/             # CRM Admin
│   │   └── showcase/          # Legacy demo page
│   │
│   ├── features/              # ⭐ Feature-based domain code (business logic)
│   │   ├── coaches/
│   │   │   ├── components/   # UI riêng của feature này
│   │   │   ├── hooks/        # Hooks riêng (useCoachList…)
│   │   │   └── index.ts      # Public API của feature
│   │   ├── booking/
│   │   ├── auth/
│   │   └── ...
│   │
│   ├── components/            # ⭐ Shared, presentational components
│   │   ├── ui/                # Atoms: Button, Input, Card, Badge, Avatar…
│   │   └── layout/            # Header, Footer, Container, Section
│   │
│   ├── services/              # ⭐ API contract layer (mock ↔ real swap)
│   │   ├── coach.service.ts
│   │   ├── sport.service.ts
│   │   └── ...
│   │
│   ├── lib/                   # Utilities, helpers, clients
│   │   ├── apiClient.ts       # Single switch: mock vs real
│   │   ├── format.ts
│   │   └── ...
│   │
│   ├── hooks/                 # Shared hooks (useDebounce, useMediaQuery…)
│   ├── types/                 # Domain types/DTOs (Coach, Sport, Booking…)
│   ├── mocks/                 # Mock data — JSON-like, matches DTO shapes
│   ├── config/                # env, constants, route paths
│   └── styles/                # Global SCSS + design tokens
│       ├── _tokens.scss
│       ├── globals.scss
│       └── blocks/            # SCSS per-block (BEM)
```

### Rule chính:
- **`app/`** chỉ chứa **route files** (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`). Không viết business logic ở đây — gọi component từ `features/` hoặc `components/`.
- **`features/`** chứa UI + logic theo domain. Một feature có thể có riêng `components/`, `hooks/`, `utils/`. Đây là nơi đại đa số code mới được viết.
- **`components/ui/`** chứa atoms/molecules **không biết gì về domain** (Button không biết Coach là gì).
- **`services/`** là **interface duy nhất** giữa UI và data. Component **KHÔNG** import trực tiếp từ `mocks/`.

---

## 3. Mock ↔ Real API Swap Pattern (CRITICAL)

Mọi service phải tuân thủ pattern này để khi BE sẵn sàng, FE chỉ cần đổi 1 biến môi trường — **không sửa 1 dòng component nào**.

### 3.1. Service interface
Mỗi domain có 1 service trong `src/services/`:
```ts
// src/services/coach.service.ts
import { apiClient } from '@lib/apiClient';
import type { Coach, CoachListQuery, Paginated } from '@types/coach';

export const coachService = {
  list: (q: CoachListQuery): Promise<Paginated<Coach>> =>
    apiClient.get('/coaches', { params: q }),

  getById: (id: string): Promise<Coach> =>
    apiClient.get(`/coaches/${id}`),

  create: (input: CreateCoachInput): Promise<Coach> =>
    apiClient.post('/coaches', input),
};
```

### 3.2. apiClient — single switch
`src/lib/apiClient.ts` đọc `NEXT_PUBLIC_DATA_SOURCE`:
- `mock` (default) → trả về data từ `src/mocks/` (có simulated latency)
- `api` → fetch thật từ `NEXT_PUBLIC_API_BASE_URL`

### 3.3. Quy tắc nghiêm ngặt
1. **Component KHÔNG import `mocks/`** — chỉ import từ `services/`.
2. **DTO types ở `src/types/`** — dùng chung cho mock và real API.
3. **Mock data shape phải khớp DTO** — nếu BE trả `snake_case`, mock cũng `snake_case`.
4. Khi BE đổi response shape → đổi DTO + mock cùng lúc → component tự động đúng.

---

## 4. Naming Conventions

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Folder | `kebab-case` | `src/features/coach-cms/` |
| Component file | `PascalCase.tsx` | `CoachCard.tsx` |
| Hook file | `useXxx.ts` | `useCoachList.ts` |
| Service file | `xxx.service.ts` | `coach.service.ts` |
| Type file | `xxx.types.ts` hoặc `xxx.ts` trong `types/` | `coach.ts` |
| Mock file | `xxx.mock.ts` | `coaches.mock.ts` |
| SCSS block | `_xxx.scss` (BEM) | `_coach-card.scss` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Boolean | `is/has/should` prefix | `isLoading`, `hasError` |
| Event handler | `handleXxx` (local), `onXxx` (props) | `handleClick`, `onSubmit` |

### Component naming
- Component name **phải khớp file name**: `CoachCard.tsx` → `export default function CoachCard()`.
- Page component trong `app/`: theo Next convention (`page.tsx` exports default).

---

## 5. Component Patterns

### 5.1. Function component + TypeScript
```tsx
type CoachCardProps = {
  coach: Coach;
  variant?: 'default' | 'compact';
  onSelect?: (id: string) => void;
};

export default function CoachCard({ coach, variant = 'default', onSelect }: CoachCardProps) {
  // ...
}
```

- **Luôn** dùng `type` cho props (không `interface` trừ khi cần `extends`).
- **Default value** đặt trong destructuring, không dùng `defaultProps`.
- **KHÔNG** dùng `React.FC` (deprecated practice — implicit `children`).

### 5.2. Server vs Client Components (Next 14 App Router)
- **Mặc định = Server Component** (không có `'use client'`).
- Thêm `'use client'` **CHỈ KHI**:
  - Dùng `useState`, `useEffect`, hoặc bất kỳ hook React nào.
  - Dùng event handlers (`onClick`, `onChange`).
  - Dùng browser API (`window`, `localStorage`).
  - Wrap thư viện chỉ chạy client-side (Swiper, Framer Motion).
- Đặt `'use client'` **ở dòng đầu file**, trước mọi `import`.

### 5.3. Composition over configuration
```tsx
// ❌ Tránh
<Card title="..." body="..." footer="..." />

// ✅ Nên
<Card>
  <Card.Title>...</Card.Title>
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```

---

## 6. Styling

### 6.1. Stack
- **CSS Variables** (`--brand`, `--success`…) — defined in `src/styles/_tokens.scss`, exposed qua `:root`.
- **SCSS BEM** — block file riêng cho mỗi component lớn (`_coach-card.scss`).
- **MUI** — chỉ dùng khi cần component có sẵn (Modal, Drawer, DatePicker…). Tránh override deep MUI styles trong SCSS.
- **Module CSS** không dùng (đã có BEM).

### 6.2. BEM
```scss
.coach-card {
  &__avatar { ... }
  &__name { ... }
  &__name--featured { ... }   // modifier
  &__rating { ... }
}
```

### 6.3. Design tokens
- **KHÔNG** hardcode màu/spacing trong SCSS hoặc inline style.
- Dùng CSS variable: `color: var(--brand-default);` hoặc SCSS var: `color: $color-brand;`.
- Nếu cần token mới → thêm vào `_tokens.scss` + `design-tokens.ts` cùng lúc.

### 6.4. Responsive
- Mobile-first: viết base style cho mobile, dùng `@media (min-width: ...)` cho desktop.
- Breakpoints: dùng SCSS variables từ `_tokens.scss` (`$bp-sm`, `$bp-md`…).

---

## 7. TypeScript

### 7.1. Strict mode bật mặc định
- Không dùng `any`. Nếu thật sự cần → comment giải thích + `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.
- `unknown` > `any` khi không biết type.

### 7.2. Type vs Interface
- **`type`** cho mọi thứ (mặc định).
- **`interface`** khi cần `extends` hoặc declaration merging.

### 7.3. DTO types
- Đặt trong `src/types/`, 1 file = 1 domain.
- Sử dụng cả ở mock lẫn service:
```ts
// src/types/coach.ts
export type Coach = {
  id: string;
  name: string;
  avatar: string;
  sports: string[];
  rating: number;
  pricePerHour: number;
  // ...
};

export type CoachListQuery = {
  sport?: string;
  minRating?: number;
  page?: number;
  pageSize?: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
```

---

## 8. Imports

### 8.1. Path aliases
Dùng path alias **luôn**, không dùng `../../../`:
```ts
// ✅
import Button from '@components/ui/Button';
import { coachService } from '@services/coach.service';

// ❌
import Button from '../../../components/ui/Button';
```

### 8.2. Import order
1. React / Next built-ins
2. External libs
3. Path-aliased internal imports (`@components`, `@services`…)
4. Relative imports (cùng folder)
5. Type-only imports (`import type { ... }`)
6. Styles (cuối cùng)

```ts
import { useState } from 'react';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';

import Button from '@components/ui/Button';
import { coachService } from '@services/coach.service';

import { CoachCardHeader } from './CoachCardHeader';

import type { Coach } from '@types/coach';

import './coach-card.scss';
```

---

## 9. State Management

### 9.1. Default
- **Local state** (`useState`) cho UI state.
- **URL state** (`useSearchParams`) cho filter/sort/pagination — chia sẻ được, deep-linkable.

### 9.2. Server state
- Đến khi có BE → dùng React Query hoặc SWR (chưa add — sẽ thêm khi cần).
- Trước đó: gọi service trực tiếp trong `useEffect` + `useState` (acceptable cho mock data).

### 9.3. Global state
- **Không add Redux/Zustand** trừ khi có nhu cầu rõ rệt.
- Auth state (sau này) → Context + custom hook.

---

## 10. Routes & Navigation

### 10.1. Single source of truth
Tất cả route paths phải khai báo trong `src/config/routes.ts`:
```ts
export const ROUTES = {
  home: '/',
  coaches: '/coaches',
  coachDetail: (id: string) => `/coaches/${id}`,
  login: '/login',
  showcase: '/showcase',
  // ...
} as const;
```

Không hardcode `'/coaches'` trong component.

### 10.2. Internal navigation
- Dùng `<Link>` từ `next/link`, **không** dùng `<a href>` cho internal route.
- Dùng `useRouter()` từ `next/navigation` (App Router) cho navigation programmatic.

---

## 11. Performance

- **Images**: dùng `next/image` với `priority` cho LCP image.
- **Fonts**: dùng `next/font/local` cho Inter Display + SVN-Apparat (đã setup trong `layout.tsx`).
- **Dynamic import** với `next/dynamic` cho component nặng client-side (charts, heavy SVG).
- **Memo** chỉ khi profile chứng minh là cần (đo Lighthouse / React DevTools).

---

## 12. Error & Loading States

Mỗi route nên có:
- `loading.tsx` — skeleton hoặc spinner.
- `error.tsx` — error boundary với retry button.

Trong service:
- Throw `Error` với message rõ ràng, **không** trả về `null` âm thầm.
- Component bắt error bằng try/catch hoặc bằng error boundary.

---

## 13. Git Commit Message

Convention: **Conventional Commits**.

```
<type>(<scope>): <subject>

Types: feat | fix | refactor | style | docs | test | chore | perf
```

Ví dụ:
```
feat(coaches): add coach detail page with booking CTA
fix(header): close mobile menu on route change
refactor(services): extract apiClient to use single env switch
docs: update CODING_CONVENTION mock-swap rule
```

---

## 14. PR Checklist

Trước khi mở PR:
- [ ] `npm run typecheck` không lỗi.
- [ ] `npm run lint` không lỗi.
- [ ] `npm run build` thành công.
- [ ] Không có `console.log` còn lại.
- [ ] Không có `any` mới (trừ khi comment giải thích).
- [ ] Component mới có TypeScript props.
- [ ] Không hardcode color/spacing/route.
- [ ] Nếu thêm service → có mock data tương ứng + DTO type.

---

## 15. Khi nào break convention?

Convention là để giúp team work nhanh hơn — không phải law of physics.
Nếu một quy ước cản trở việc deliver giá trị → mở Discussion, đề xuất thay đổi, cả team agree → update doc + áp dụng cho code mới.

**KHÔNG** im lặng break rule và để reviewer phát hiện trong PR.

---

_Last updated: 2026-05-27_
