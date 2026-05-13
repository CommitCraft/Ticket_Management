import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppSelector } from '../../hooks/useAppSelector';

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = useAppSelector((state) => state.auth.user?.roleKey);

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileMenuOpen((value) => !value)} />
        <main className="flex-1 px-4 py-6 md:px-6">
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
