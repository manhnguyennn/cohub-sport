/**
 * localStorage layer cho persona (Demo Mode persistence).
 *
 * Lưu chỉ persona KEY + selected role — không lưu user object.
 * Khi load: lookup persona registry → resolve user.
 *
 * Không dùng từ component trực tiếp — gọi qua usePersona() hook.
 */
import type { Persona, PersonaKey } from '@app-types/persona';
import type { UserRole } from '@app-types/user';

const KEY_PERSONA = 'cohub:persona';
const KEY_ROLE    = 'cohub:role';

export type PersistedPersonaState = {
  personaKey: PersonaKey;
  role: UserRole | null;
};

const DEFAULT_STATE: PersistedPersonaState = {
  personaKey: 'guest',
  role: null,
};

export function readPersistedPersona(): PersistedPersonaState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const personaKey = (localStorage.getItem(KEY_PERSONA) as PersonaKey | null) ?? 'guest';
    const role = (localStorage.getItem(KEY_ROLE) as UserRole | null) ?? null;
    return { personaKey, role };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writePersistedPersona(state: PersistedPersonaState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_PERSONA, state.personaKey);
    if (state.role) localStorage.setItem(KEY_ROLE, state.role);
    else localStorage.removeItem(KEY_ROLE);
  } catch {
    /* ignore quota errors */
  }
}

export function clearPersistedPersona(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY_PERSONA);
    localStorage.removeItem(KEY_ROLE);
  } catch { /* ignore */ }
}

/** Resolve role mặc định khi switch persona (FSD §3.4) */
export function defaultRoleFor(persona: Persona): UserRole | null {
  return persona.defaultRole;
}
