import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return <div className="flex h-screen items-center justify-center text-sm text-slate-500">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
