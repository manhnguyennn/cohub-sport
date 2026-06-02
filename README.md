# CoHub — Next.js 14 App

Frontend cho CoHub platform: marketplace kết nối user với HLV chuyên môn (thể thao, ngôn ngữ, tech…).

## Stack
- **Next.js 14** (App Router) + **TypeScript 5** (strict)
- **MUI 7** + **SCSS BEM** + CSS Variables
- **Framer Motion**, **Swiper**, **react-fast-marquee**

## Getting Started

```bash
# install
npm install

# dev (http://localhost:3000)
npm run dev

# build
npm run build

# typecheck
npm run typecheck

# lint
npm run lint
```

## Environment

Copy `.env.example` → `.env.local`. Biến quan trọng nhất:

| Var | Default | Mô tả |
|---|---|---|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` | `mock` dùng data local, `api` gọi BE thật |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api/v1` | Base URL khi `DATA_SOURCE=api` |
| `NEXT_PUBLIC_MOCK_LATENCY_MS` | `150` | Giả lập độ trễ network khi mock |

## Routes hiện có

| Path | Mục đích |
|---|---|
| `/` | **Home mới** — search HLV, categories, featured coaches |
| `/coaches` | Danh sách HLV với filter |
| `/coaches/[id]` | Chi tiết HLV (TODO) |
| `/booking` | Booking flow (TODO) |
| `/login`, `/register` | Auth (TODO) |
| `/coach-cms` | CMS cho HLV (TODO) |
| `/admin` | CRM Admin (TODO) |
| `/showcase` | **Legacy** — preview các section của bản v1 |

## Folder Structure

Xem [CODING_CONVENTION.md](./CODING_CONVENTION.md).

Quy ước cốt lõi: component **không bao giờ** import từ `mocks/` — luôn đi qua `services/`. Khi BE ready chỉ cần đổi `NEXT_PUBLIC_DATA_SOURCE=api`.
