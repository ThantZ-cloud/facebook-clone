import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for notifications with polling.
 * Fetches notifications on mount and polls every 30 seconds.
 *
 * Returns:
 * - notifications: array of notification objects
 * - unreadCount: number of unread notifications
 * - fetchNotifications: manually re-fetch
 * - markAsRead(id): mark single notification as read
 * - markAllAsRead(): mark all as read
 */
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from the API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);

      // Count unread
      const unread = response.data.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  }, []);

  // Fetch on mount, then poll every 30 seconds
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      // Update local state immediately (no need to re-fetch)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

export default useNotifications;
