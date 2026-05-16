import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listNotifications } from '../../services/notifications';
import { cn } from '../../utils/cn';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const loadNotifications = async () => {
    // Debounce: prevent requests within 5 seconds
    const now = Date.now();
    if (now - lastFetch < 5000) return;
    setLastFetch(now);

    try {
      const notifications = await listNotifications();
      const count = notifications.filter((n: any) => !n.readAt).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  useEffect(() => {
    void loadNotifications();
    // Refresh notifications every 30 seconds (prevents 429 rate limit errors)
    const interval = setInterval(() => loadNotifications(), 30000);
    return () => clearInterval(interval);
  }, [lastFetch]);

  return (
    <Link
      to="/notifications"
      className={cn(
        'relative inline-flex items-center justify-center h-10 w-10 rounded-lg transition',
        'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      )}
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
