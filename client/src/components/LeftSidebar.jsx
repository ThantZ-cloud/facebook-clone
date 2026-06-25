import { Box, Typography, Avatar, List, ListItemButton, ListItemAvatar, ListItemText, Divider, IconButton } from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Favorite as LikeIcon,
  Comment as CommentIcon,
  CheckCircle as AcceptedIcon,
  Notifications as NotificationsIcon,
  DoneAll as MarkAllReadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useNotifications from '../hooks/useNotifications';

// Get icon for notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'FRIEND_REQUEST':
      return <PersonAddIcon sx={{ fontSize: 14 }} />;
    case 'FRIEND_REQUEST_ACCEPTED':
      return <AcceptedIcon sx={{ fontSize: 14 }} />;
    case 'POST_LIKE':
      return <LikeIcon sx={{ fontSize: 14 }} />;
    case 'POST_COMMENT':
      return <CommentIcon sx={{ fontSize: 14 }} />;
    default:
      return <NotificationsIcon sx={{ fontSize: 14 }} />;
  }
};

// Generate notification message
const getNotificationMessage = (notification) => {
  const name = notification.actor?.name || 'Someone';
  switch (notification.type) {
    case 'FRIEND_REQUEST':
      return `${name} sent you a friend request`;
    case 'FRIEND_REQUEST_ACCEPTED':
      return `${name} accepted your friend request`;
    case 'POST_LIKE':
      return `${name} liked your post`;
    case 'POST_COMMENT':
      return `${name} commented on your post`;
    default:
      return `${name} interacted with your content`;
  }
};

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
};

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Handle clicking on a notification
  const handleClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    switch (notification.type) {
      case 'FRIEND_REQUEST':
      case 'FRIEND_REQUEST_ACCEPTED':
        navigate('/friends');
        break;
      case 'POST_LIKE':
      case 'POST_COMMENT':
        navigate('/');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        py: 2,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <IconButton size="small" onClick={markAllAsRead} title="Mark all as read">
            <MarkAllReadIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 40, color: '#BCC0C4', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No notifications yet
          </Typography>
        </Box>
      ) : (
        <List disablePadding sx={{ px: 0.5 }}>
          {notifications.map((notif) => (
            <ListItemButton
              key={notif.id}
              onClick={() => handleClick(notif)}
              sx={{
                borderRadius: 2,
                mb: 0.3,
                bgcolor: notif.read ? 'transparent' : '#F0F8FF',
                '&:hover': { bgcolor: '#F0F2F5' },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 44 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={notif.actor?.avatar ? `http://localhost:5000${notif.actor.avatar}` : undefined}
                    sx={{ width: 36, height: 36, bgcolor: '#1877F2' }}
                  >
                    {notif.actor?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  {/* Type icon badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      bgcolor: '#1877F2',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      border: '2px solid white',
                    }}
                  >
                    {getNotificationIcon(notif.type)}
                  </Box>
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={getNotificationMessage(notif)}
                secondary={formatTime(notif.createdAt)}
                primaryTypographyProps={{
                  fontSize: '0.82rem',
                  fontWeight: notif.read ? 400 : 600,
                  lineHeight: 1.3,
                }}
                secondaryTypographyProps={{ fontSize: '0.7rem' }}
              />
            </ListItemButton>
          ))}
        </List>
      )}

      {/* Footer */}
      <Box sx={{ px: 3, mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Privacy · Terms · Advertising · Cookies · More · Meta © 2024
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftSidebar;
