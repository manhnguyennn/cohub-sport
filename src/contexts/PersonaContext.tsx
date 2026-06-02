'use client';

/**
 * PersonaContext — global state cho persona + role hiện tại.
 *
 * Provider mount 1 lần ở app/layout.tsx, đọc localStorage init.
 * Component dùng qua usePersona() hook.
 *
 * Khi switch persona → reset role về defaultRole của persona đó.
 * Khi switch role → giữ persona, đổi role (chỉ những role persona cho phép).
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Persona, PersonaKey } from '@app-types/persona';
import type { User, UserRole } from '@app-types/user';
import { personas, userMocks } from '@mocks/personas.mock';
import {
  defaultRoleFor,
  readPersistedPersona,
  writePersistedPersona,
} from '@lib/persona-storage';

type PersonaContextValue = {
  /** Persona đang active (luôn có, default = guest) */
  persona: Persona;
  /** User object nếu persona !== guest, null nếu guest */
  user: User | null;
  /** Role đang active của user (vd: dual-role coach swap về user) */
  role: UserRole | null;
  /** Boolean shortcut */
  isLoggedIn: boolean;
  /** Đã đọc localStorage xong chưa — tránh hydration mismatch */
  isReady: boolean;

  // Actions
  switchPersona: (key: PersonaKey) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
};

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personaKey, setPersonaKey] = useState<PersonaKey>('guest');
  const [role, setRole] = useState<UserRole | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Hydrate từ localStorage (chỉ chạy client side)
  useEffect(() => {
    const persisted = readPersistedPersona();
    setPersonaKey(persisted.personaKey);
    setRole(persisted.role ?? personas[persisted.personaKey].defaultRole);
    setIsReady(true);
  }, []);

  const persona = personas[personaKey];
  const user = persona.userId ? userMocks[persona.userId] ?? null : null;

  const switchPersona = useCallback((key: PersonaKey) => {
    const next = personas[key];
    const nextRole = defaultRoleFor(next);
    setPersonaKey(key);
    setRole(nextRole);
    writePersistedPersona({ personaKey: key, role: nextRole });
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
    writePersistedPersona({ personaKey, role: newRole });
  }, [personaKey]);

  const logout = useCallback(() => {
    setPersonaKey('guest');
    setRole(null);
    writePersistedPersona({ personaKey: 'guest', role: null });
  }, []);

  const value = useMemo<PersonaContextValue>(
    () => ({
      persona,
      user,
      role,
      isLoggedIn: persona.key !== 'guest',
      isReady,
      switchPersona,
      switchRole,
      logout,
    }),
    [persona, user, role, isReady, switchPersona, switchRole, logout],
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona() must be used inside <PersonaProvider>');
  return ctx;
}
