import { Archive, BarChart3, Boxes, ChevronRight, FileText, LayoutDashboard, Lock, PanelLeftClose, Shield, Ticket, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';
import type { RoleKey } from '../../types/auth';
import AplosLogo from './AplosLogo';

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

export function Sidebar({
  role,
  mobile = false,
  collapsed = false,
  onToggleCollapse
}: {
  role?: RoleKey;
  mobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const isCompact = collapsed && !mobile;

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen shrink-0 border-r border-white/60 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/70',
        isCompact ? 'w-20 px-3 py-5' : 'w-72 p-5',
        mobile ? 'block lg:hidden' : 'hidden lg:block'
      )}
    >
      <div className={cn('mb-8 flex items-start justify-between gap-3', isCompact && 'flex-col items-center')}>
        <div className={cn(isCompact && 'text-center')}>
          <AplosLogo
            size={isCompact ? 'sm' : 'md'}
            showTagline={!isCompact}
            taglineColor={isCompact ? '#64748b' : '#475569'}
            align={isCompact ? 'center' : 'start'}
          />
        </div>
        {onToggleCollapse ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex"
            aria-label={isCompact ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCompact ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCompact ? <ChevronRight className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        ) : null}
      </div>
      <nav className={cn('space-y-1', isCompact && 'space-y-2')}>
        {navItems.filter((item) => !item.roles || (role && item.roles.includes(role))).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCompact ? item.label : undefined}
            aria-label={item.label}
            className={({ isActive }) => cn(
              'flex items-center rounded-xl py-2 text-sm font-medium transition',
              isCompact ? 'justify-center px-2' : 'gap-3 px-3',
              isActive ? 'bg-slate-900 text-white dark:bg-blue-500' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            <item.icon className="h-4 w-4" />
            {!isCompact ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
