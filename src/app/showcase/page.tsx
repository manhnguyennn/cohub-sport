import Link from 'next/link';
import { Badge, Button, Card, Container } from '@components/ui';
import { ROUTES } from '@config/routes';

export const metadata = {
  title: 'Showcase — Legacy v1 preview',
  description: 'Preview các section của bản marketing landing v1.',
};

const LEGACY_SECTIONS = [
  { key: 'hero',       title: 'Hero',        desc: 'Hero của bản v1 — gradient blue, CTA chính.' },
  { key: 'sports',     title: 'Sports',      desc: 'Carousel danh mục thể thao (Swiper).' },
  { key: 'tech',       title: 'Tech',        desc: 'Danh mục công nghệ với layout grid.' },
  { key: 'hr',         title: 'HR',          desc: 'Section HR + tư vấn doanh nghiệp.' },
  { key: 'language',   title: 'Language',    desc: 'Học ngôn ngữ — marquee instructors.' },
  { key: 'experts',    title: 'Experts',     desc: 'Marquee infinite các expert nổi bật.' },
  { key: 'benefits',   title: 'Benefits',    desc: 'Lợi ích nền tảng — icons + heading.' },
  { key: 'ai',         title: 'AI Agent',    desc: 'Section AI agent gradient navy.' },
  { key: 'b2b',        title: 'B2B',         desc: 'Giải pháp doanh nghiệp — CTA logos.' },
  { key: 'stats',      title: 'Stats',       desc: 'Số liệu nổi bật — dark card.' },
  { key: 'blog',       title: 'Blog',        desc: 'Latest articles — 3 columns.' },
  { key: 'newsletter', title: 'Newsletter',  desc: 'Đăng ký nhận bản tin — gradient blue.' },
];

export default function ShowcasePage() {
  return (
    <>
      <div className="showcase-banner">
        <strong>⚠ Legacy v1 demo</strong> — Đây là sản phẩm cũ, giữ lại để tham khảo. Sản phẩm chính ở{' '}
        <Link href={ROUTES.home}>trang chủ</Link>.
      </div>

      <Container>
        <div style={{ padding: '48px 0' }}>
          <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: 700, marginBottom: 12 }}>
            CoHub v1 — Showcase
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 720, marginBottom: 24 }}>
            Đây là bản marketing landing v1 với 13 section. Hiện được archive khi sản phẩm chính chuyển
            sang flow marketplace. Code gốc nằm ở folder <code>../src/components/</code> (CRA project).
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
            <Badge variant="warning">Archived</Badge>
            <Badge variant="info">13 sections</Badge>
            <Badge variant="neutral">CRA project</Badge>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {LEGACY_SECTIONS.map((s) => (
              <Card key={s.key} variant="default">
                <Card.Body>
                  <Card.Title>{s.title}</Card.Title>
                  <Card.Text>{s.desc}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div
            style={{
              marginTop: 64,
              padding: 32,
              background: 'var(--bg-subtle)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, marginBottom: 12 }}>
              Muốn xem bản v1 đầy đủ?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Vào folder <code>cohub-main/</code> (project CRA cũ), chạy <code>npm start</code> — sẽ render
              landing page v1 ở <code>http://localhost:3000</code>.
            </p>
            <Button href={ROUTES.home} variant="primary">
              Về Home mới
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
