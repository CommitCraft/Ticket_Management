import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import type { RoleKey } from '../types/auth';

export function RoleGate({ roles, children }: { roles: RoleKey[]; children: ReactElement }) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.roleKey) && user.roleKey !== 'super_admin') {
    return <Navigate to="/tickets" replace />;
  }

  return children;
}
