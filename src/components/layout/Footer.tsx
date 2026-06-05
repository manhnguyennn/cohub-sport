import Link from 'next/link';
import { FOOTER_NAV } from '@config/routes';
import { cn } from '@lib/cn';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div>
            <div className="footer__brand">CoHub</div>
            <p className="footer__tagline">
              Marketplace kết nối bạn với chuyên gia hàng đầu trong thể thao, công nghệ và phát triển bản thân.
            </p>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="footer__col-title">{col.title}</h4>
              <ul className="footer__link-list">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn('footer__link', item.status === 'wip' && 'footer__link--wip')}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <div>© {new Date().getFullYear()} CoHub. All rights reserved.</div>
          <div>Made in Vietnam</div>
        </div>
      </div>
    </footer>
  );
}
