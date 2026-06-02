'use client';

/**
 * Demo Mode Panel — UI cho FSD §5.
 *
 * Mở: Ctrl+Shift+D hoặc URL ?demo=1
 * Persona switcher, toggles, reset.
 */
import { usePersona } from '@contexts/PersonaContext';
import { useDemoMode } from '@contexts/DemoModeContext';
import { useToast } from '@contexts/ToastContext';
import { PERSONA_KEYS, personas } from '@mocks/personas.mock';
import type { PersonaKey } from '@app-types/persona';

export default function DemoModePanel() {
  const { persona, switchPersona } = usePersona();
  const { toast } = useToastShortcuts();
  const { isPanelOpen, closePanel, toggles, setToggle, resetAll } = useDemoMode();

  if (!isPanelOpen) return null;

  function handleSwitch(key: PersonaKey) {
    switchPersona(key);
    toast.info(`Đã chuyển sang persona: ${personas[key].displayLabel}`);
  }

  function handleResetState() {
    // Clear toàn bộ localStorage cohub:* + sessionStorage cohub:demo:*
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('cohub:'))
        .forEach((k) => localStorage.removeItem(k));
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('cohub:'))
        .forEach((k) => sessionStorage.removeItem(k));
    }
    resetAll();
    toast.success('Đã reset toàn bộ state. Reload trang...');
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <>
      <div className="demo-panel__backdrop" onClick={closePanel} aria-hidden />
      <aside className="demo-panel" role="dialog" aria-label="Demo Mode panel">
        <header className="demo-panel__header">
          <div>
            <strong>Demo Mode</strong>
            <span className="demo-panel__hint">Ctrl+Shift+D để đóng/mở</span>
          </div>
          <button type="button" className="demo-panel__close" onClick={closePanel} aria-label="Đóng">×</button>
        </header>

        <section className="demo-panel__section">
          <h4>Persona đang active</h4>
          <div className="demo-panel__active">
            <strong>{persona.displayLabel}</strong>
            <p>{persona.description}</p>
          </div>

          <h4>Chuyển persona</h4>
          <div className="demo-panel__personas">
            {PERSONA_KEYS.map((key) => {
              const p = personas[key];
              const active = persona.key === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`demo-panel__persona ${active ? 'is-active' : ''}`}
                  onClick={() => handleSwitch(key)}
                  disabled={active}
                >
                  <strong>{p.displayLabel}</strong>
                  <small>{p.description}</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="demo-panel__section">
          <h4>Toggles</h4>
          <Toggle
            label="Investor mode"
            description="Disable mọi error, accelerate timer 5× (5s → 1s). Dùng khi demo cho investor."
            checked={toggles.investorMode}
            onChange={(v) => setToggle('investorMode', v)}
          />
          <Toggle
            label="Force payment fail"
            description="Mọi fake payment tiếp theo sẽ fail để demo error state."
            checked={toggles.forcePaymentFail}
            onChange={(v) => setToggle('forcePaymentFail', v)}
          />
          <Toggle
            label="Slow network"
            description="Loading state chạy chậm 3× để demo skeleton & spinner."
            checked={toggles.slowNetwork}
            onChange={(v) => setToggle('slowNetwork', v)}
          />
          <Toggle
            label="Coach auto-confirm OFF"
            description="Booking KHÔNG auto-confirm sau 3s — demo flow chờ coach 12h."
            checked={toggles.coachAutoConfirmOff}
            onChange={(v) => setToggle('coachAutoConfirmOff', v)}
          />
        </section>

        <section className="demo-panel__section">
          <h4>Actions</h4>
          <button type="button" className="demo-panel__btn" onClick={handleResetState}>
            Reset toàn bộ state
          </button>
          <button type="button" className="demo-panel__btn demo-panel__btn--ghost" onClick={() => {
            toast.success('Đã trigger notification mẫu!');
          }}>
            Trigger toast mẫu
          </button>
        </section>
      </aside>
    </>
  );
}

// Tách sub-component để giữ panel readable
function Toggle({
  label, description, checked, onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="demo-panel__toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div>
        <strong>{label}</strong>
        <small>{description}</small>
      </div>
    </label>
  );
}

// Helper local — tránh import circular toast
function useToastShortcuts() {
  const toast = useToast();
  return { toast };
}
