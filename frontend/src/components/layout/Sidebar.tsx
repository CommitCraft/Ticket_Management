import { Archive, BarChart3, Boxes, FileText, LayoutDashboard, Lock, Shield, Ticket, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import type { RoleKey } from '../../types/auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'support_agent'] as RoleKey[] },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['super_admin', 'admin', 'support_agent'] as RoleKey[] },
  { to: '/profile', label: 'Profile', icon: FileText },
  { to: '/users', label: 'Users', icon: Users, roles: ['super_admin', 'admin'] as RoleKey[] },
  { to: '/roles', label: 'Roles', icon: Shield, roles: ['super_admin'] as RoleKey[] },
  { to: '/permissions', label: 'Permissions', icon: Lock, roles: ['super_admin'] as RoleKey[] },
  { to: '/departments', label: 'Departments', icon: Boxes, roles: ['super_admin', 'admin'] as RoleKey[] },
  { to: '/audit-logs', label: 'Audit Logs', icon: Archive, roles: ['super_admin'] as RoleKey[] }
];

export function Sidebar({ role, mobile = false }: { role?: RoleKey; mobile?: boolean }) {
  return (
    <aside className={cn('w-72 shrink-0 border-r border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70', mobile ? 'block lg:hidden' : 'hidden lg:block')}>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Enterprise Helpdesk</p>
        <h2 className="mt-2 text-2xl font-bold">Ticket Ops</h2>
      </div>
      <nav className="space-y-1">
        {navItems.filter((item) => !item.roles || (role && item.roles.includes(role))).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              isActive ? 'bg-slate-900 text-white dark:bg-blue-500' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
