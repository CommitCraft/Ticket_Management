import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppSelector } from '../../hooks/useAppSelector';

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedValue = window.localStorage.getItem('helpdesk-sidebar-collapsed');
    return savedValue === 'true';
  });
  const role = useAppSelector((state) => state.auth.user?.roleKey);

  useEffect(() => {
    window.localStorage.setItem('helpdesk-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileMenuOpen((value) => !value)} />
        <main className="min-h-0 flex-1 min-w-0 overflow-y-auto px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
      {mobileMenuOpen ? (
        <>
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 z-40 h-full lg:hidden">
            <Sidebar role={role} mobile />
          </div>
        </>
      ) : null}
    </div>
  );
}
