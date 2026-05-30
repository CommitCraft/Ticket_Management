import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { listNotifications } from '../../services/notifications';
import { cn } from '../../utils/cn';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const lastFetchRef = useRef<number>(0);
  const location = useLocation();
  const isNotificationsPage = location.pathname === '/notifications';

  const loadNotifications = async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < 5000) return;
    lastFetchRef.current = now;

    try {
      const notifications = await listNotifications();
      const count = notifications.filter((n: any) => !n.readAt).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  useEffect(() => {
    if (isNotificationsPage) return;

    void loadNotifications();
    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isNotificationsPage]);

  return (
    <Link
      to="/notifications"
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-lg border transition',
        'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
      )}
      aria-label="Notifications"
      title="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
