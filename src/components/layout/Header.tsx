'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { MAIN_NAV, ROUTES } from '@config/routes';
import { Button } from '@components/ui';
import { cn } from '@lib/cn';
import { usePersona } from '@contexts/PersonaContext';
import { useDemoMode } from '@contexts/DemoModeContext';
import type { UserRole } from '@app-types/user';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const { persona, user, role, isLoggedIn, switchRole, logout } = usePersona();
  const { openPanel } = useDemoMode();

  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user dropdown when click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  const isActive = (href: string) => {
    if (href === ROUTES.home) return pathname === '/';
    return pathname?.startsWith(href);
  };

  const canSwitchRole = persona.roles.length > 1;

  function handleSwitchRole(newRole: UserRole) {
    switchRole(newRole);
    setUserMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <Link href={ROUTES.home} className="header__brand" aria-label="CoHub">
            <Image
              src="/images/cohub-logo.svg"
              alt="CoHub"
              className="header__logo-icon"
              width={120}
              height={32}
              priority
            />
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'header__nav-link',
                  isActive(item.href) && 'header__nav-link--active',
                  item.status === 'wip' && 'header__nav-link--wip',
                )}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="header__actions">
          {/* Demo mode quick toggle — chỉ hiện khi đã từng mở */}
          <button
            type="button"
            className="header__demo-trigger"
            onClick={openPanel}
            aria-label="Mở Demo Mode panel"
            title="Demo Mode (Ctrl+Shift+D)"
          >
            ⚙
          </button>

          {isLoggedIn && user ? (
            <div className="header__user-wrap" ref={userMenuRef}>
              <button
                type="button"
                className="header__user"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <Image
                  src={user.avatar ?? '/images/Container.webp'}
                  alt={user.fullName}
                  width={32}
                  height={32}
                  className="header__user-avatar"
                />
                <span className="header__user-name">{user.fullName.split(' ').slice(-1)}</span>
                <span className="header__user-role">{labelForRole(role)}</span>
              </button>

              {userMenuOpen && (
                <div className="header__user-menu" role="menu">
                  <div className="header__user-menu-head">
                    <strong>{user.fullName}</strong>
                    <small>{user.email}</small>
                  </div>

                  {canSwitchRole && (
                    <div className="header__user-menu-section">
                      <span className="header__user-menu-label">Chuyển vai trò</span>
                      {persona.roles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={cn(
                            'header__user-menu-item',
                            r === role && 'header__user-menu-item--active',
                          )}
                          onClick={() => handleSwitchRole(r)}
                          disabled={r === role}
                        >
                          {labelForRole(r)}
                          {r === role && <span aria-hidden>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="header__user-menu-section">
                    {role === 'coach' && (
                      <Link href={ROUTES.coachCms} className="header__user-menu-item" role="menuitem">
                        Coach Dashboard
                      </Link>
                    )}
                    {role === 'admin' && (
                      <Link href={ROUTES.admin} className="header__user-menu-item" role="menuitem">
                        Admin Console
                      </Link>
                    )}
                    <Link href="/my/bookings" className="header__user-menu-item" role="menuitem">
                      Buổi tập của tôi
                    </Link>
                  </div>

                  <div className="header__user-menu-section">
                    <button
                      type="button"
                      className="header__user-menu-item header__user-menu-item--danger"
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button href={ROUTES.login} variant="secondary" size="sm">
                Đăng nhập
              </Button>
              <Button href={ROUTES.register} variant="primary" size="sm">
                Bắt đầu miễn phí
              </Button>
            </>
          )}

          <button
            className="header__burger"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={cn('header__mobile-menu', open && 'header__mobile-menu--open')}>
        {MAIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'header__mobile-nav-item',
              isActive(item.href) && 'header__mobile-nav-item--active',
            )}
          >
            {item.label}
            {item.status === 'wip' && (
              <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.6 }}>(WIP)</span>
            )}
          </Link>
        ))}
        {!isLoggedIn && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button href={ROUTES.login} variant="secondary" block>Đăng nhập</Button>
            <Button href={ROUTES.register} variant="primary" block>Đăng ký</Button>
          </div>
        )}
      </div>
    </header>
  );
}

function labelForRole(role: UserRole | null): string {
  switch (role) {
    case 'user':  return 'Học viên';
    case 'coach': return 'Coach';
    case 'admin': return 'Admin';
    default:      return '—';
  }
}
