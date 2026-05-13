import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import type { RoleKey } from '../types/auth';

export function RoleGate({ roles, children }: { roles: RoleKey[]; children: JSX.Element }) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.roleKey) && user.roleKey !== 'super_admin') {
    return <Navigate to="/tickets" replace />;
  }

  return children;
}
