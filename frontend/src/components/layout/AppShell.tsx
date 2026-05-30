import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronRight, PanelLeftClose } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Button } from '../ui/button';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearCredentials } from '../../store/authSlice';
import { logoutRequest } from '../../services/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedValue = window.localStorage.getItem('helpdesk-sidebar-collapsed');
    return savedValue === 'true';
  });
  const role = useAppSelector((state) => state.auth.user?.roleKey);

  const handleLogout = async () => {
    await logoutRequest();
    dispatch(clearCredentials());
    toast.success('Logged out');
    navigate('/login');
  };

  useEffect(() => {
    window.localStorage.setItem('helpdesk-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        collapsed={sidebarCollapsed}
        onLogout={handleLogout}
      />
      <div className="relative z-20 flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* <div className="relative hidden lg:block">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="absolute -left-3 top-4 z-50 h-9 w-9 rounded-full border-slate-200 bg-white p-0 shadow-md dark:border-slate-700 dark:bg-slate-950"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div> */}
        <Navbar onMenuClick={() => setMobileMenuOpen((value) => !value)} />
        <main className="min-h-0 flex-1 min-w-0 overflow-y-auto px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
      {mobileMenuOpen ? (
        <>
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 z-40 h-full lg:hidden">
            <Sidebar role={role} mobile onLogout={handleLogout} />
          </div>
        </>
      ) : null}
    </div>
  );
}
