import { createContext, useContext, useState, useCallback } from 'react';

export const ROLES = {
  BUYER: 'buyer',
  BROKER: 'broker',
};

export const ROLE_LABELS = {
  buyer: 'Buyer / Investor',
  broker: 'Broker / CP',
};

export const ROLE_COLORS = {
  buyer: '#4F46E5',
  broker: '#059669',
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('propOS_role');
    // Guard: builder role no longer exists on frontend
    if (saved === 'builder') return ROLES.BUYER;
    return saved || ROLES.BUYER;
  });

  const switchRole = useCallback((newRole) => {
    setRole(newRole);
    localStorage.setItem('propOS_role', newRole);
  }, []);

  return (
    <RoleContext.Provider value={{ role, switchRole, ROLES, ROLE_LABELS, ROLE_COLORS }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
