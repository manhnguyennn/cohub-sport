'use client';

/**
 * /admin/reviews — Queue duyệt coach (H6).
 * Table + SLA countdown + drawer phải với profile + checklist 7 tiêu chí
 * + Duyệt / Từ chối / Yêu cầu sửa.
 */
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EmptyState, SkeletonList } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { formatVND } from '@lib/date';
import { adminService } from '@services/admin.service';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { cn } from '@lib/cn';
import type { AdminReviewItem, AdminReviewDecision } from '@app-types/admin';

const CHECKLIST = [
  'Ảnh đại diện rõ mặt, phù hợp',
  'Bio đầy đủ, không lộ thông tin liên hệ (PII)',
  'Bộ môn & kinh nghiệm hợp lý',
  'Chứng chỉ hợp lệ, còn hiệu lực',
  'Mức giá phù hợp thị trường',
  'Khu vực & hình thức dạy rõ ràng',
  'Không vi phạm chính sách nền tảng',
];

function slaLabel(deadline: string): { text: string; danger: boolean } {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return { text: 'Quá hạn SLA', danger: true };
  const h = Math.floor(ms / 3600_000);
  const m = Math.floor((ms % 3600_000) / 60_000);
  return { text: `Còn ${h}h ${m}m`, danger: h < 6 };
}

export default function AdminReviewsClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState<AdminReviewItem[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: '/admin/reviews' }); return; }
    if (role !== 'admin') { router.replace('/'); return; }
    adminService.reviews().then(setItems).catch(() => setItems([]));
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  const active = useMemo(() => items?.find((x) => x.id === activeId) ?? null, [items, activeId]);

  function openDrawer(id: string) {
    setActiveId(id);
    setChecked(CHECKLIST.map(() => false));
  }

  async function decide(decision: AdminReviewDecision) {
    if (!active || busy) return;
    setBusy(true);
    const label = decision === 'approve' ? 'Đã duyệt' : decision === 'reject' ? 'Đã từ chối' : 'Đã yêu cầu chỉnh sửa';
    setItems((prev) => (prev ? prev.filter((x) => x.id !== active.id) : prev));
    setActiveId(null);
    try {
      await adminService.decide(active.id, decision);
      toast.success(`${label} hồ sơ ${active.coachName}.`);
    } catch {
      toast.error('Có lỗi, vui lòng thử lại.');
      adminService.reviews().then(setItems).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        <header className="cms-page-head">
          <div>
            <h1 className="cms-page-head__title">Duyệt huấn luyện viên</h1>
            <p className="cms-page-head__sub">Hồ sơ chờ duyệt — ưu tiên theo hạn SLA (≤24h).</p>
          </div>
        </header>

        {items === null ? (
          <SkeletonList rows={4} />
        ) : items.length === 0 ? (
          <EmptyState title="Hết hồ sơ chờ duyệt" description="Tất cả hồ sơ đã được xử lý. Hồ sơ mới sẽ xuất hiện tại đây." />
        ) : (
          <div className="admin-queue">
            {items.map((it) => {
              const sla = slaLabel(it.slaDeadline);
              return (
                <button key={it.id} type="button" className="admin-queue__row" onClick={() => openDrawer(it.id)}>
                  <span className="admin-queue__avatar">
                    {it.avatar ? <Image src={it.avatar} alt="" width={44} height={44} style={{ objectFit: 'cover' }} /> : it.coachName.charAt(0)}
                  </span>
                  <span className="admin-queue__main">
                    <strong>{it.coachName}</strong>
                    <small>{it.sport} · {it.city} · {it.experienceYears} năm KN</small>
                  </span>
                  <span className={cn('admin-queue__tier', it.tier === 2 && 'is-t2')}>
                    {it.tier === 1 ? 'Hồ sơ cơ bản' : 'Xác minh KYC'}
                  </span>
                  <span className={cn('admin-queue__sla', sla.danger && 'is-danger')}>
                    <AppIcon name="clock" size={14} /> {sla.text}
                  </span>
                  <AppIcon name="next" size={16} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Drawer */}
      {active && (
        <div className="admin-drawer" role="dialog" aria-modal="true">
          <div className="admin-drawer__backdrop" onClick={() => setActiveId(null)} />
          <aside className="admin-drawer__panel">
            <header className="admin-drawer__head">
              <h3>Hồ sơ {active.coachName}</h3>
              <button type="button" className="admin-drawer__close" onClick={() => setActiveId(null)} aria-label="Đóng">
                <AppIcon name="close" size={20} />
              </button>
            </header>

            <div className="admin-drawer__body">
              <div className="admin-drawer__profile">
                <span className="admin-drawer__avatar">
                  {active.avatar ? <Image src={active.avatar} alt="" width={64} height={64} style={{ objectFit: 'cover' }} /> : active.coachName.charAt(0)}
                </span>
                <div>
                  <strong>{active.coachName}</strong>
                  <span>{active.sport} · {active.city}</span>
                  <span>{active.experienceYears} năm KN · {formatVND(active.pricePerHour)}/giờ</span>
                </div>
              </div>

              <section className="admin-drawer__section">
                <h4>Giới thiệu</h4>
                <p>{active.bio}</p>
              </section>

              <section className="admin-drawer__section">
                <h4>Chứng chỉ ({active.certificates.length})</h4>
                <ul className="admin-drawer__certs">
                  {active.certificates.map((c) => (
                    <li key={c.name}><AppIcon name="medal" size={15} /> {c.name} <small>· {c.year}</small></li>
                  ))}
                </ul>
              </section>

              <section className="admin-drawer__section">
                <h4>Checklist duyệt (7 tiêu chí)</h4>
                <ul className="admin-checklist">
                  {CHECKLIST.map((c, i) => (
                    <li key={c}>
                      <label>
                        <input type="checkbox" checked={checked[i]} onChange={() => setChecked((p) => p.map((v, j) => (j === i ? !v : v)))} />
                        {c}
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <footer className="admin-drawer__actions">
              <button type="button" className="admin-drawer__reject" disabled={busy} onClick={() => decide('reject')}>Từ chối</button>
              <button type="button" className="admin-drawer__edit" disabled={busy} onClick={() => decide('request_edit')}>Yêu cầu sửa</button>
              <button type="button" className="admin-drawer__approve" disabled={busy} onClick={() => decide('approve')}>
                <AppIcon name="check" size={16} color="#fff" /> Duyệt
              </button>
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
}
