import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem,
  ListItemIcon, Divider, InputBase, Badge, Tooltip, Paper, List, ListItemButton,
  ListItemAvatar, ListItemText, CircularProgress, ClickAwayListener
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  People as FriendsIcon,
  Chat as MessengerIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Favorite as LikeIcon,
  Comment as CommentIcon,
  CheckCircle as AcceptedIcon,
  DoneAll as MarkAllReadIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import useNotifications from '../hooks/useNotifications';
import api from '../services/api';

// Navigation tabs in the center of the navbar
const navTabs = [
  { icon: <HomeIcon />, label: 'Home', path: '/' },
  { icon: <PersonIcon />, label: 'Profile', path: '/profile' },
  { icon: <FriendsIcon />, label: 'Friends', path: '/friends' },
];

// Generate human-readable notification message
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

// Get icon for notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'FRIEND_REQUEST':
      return <PersonAddIcon sx={{ fontSize: 16 }} />;
    case 'FRIEND_REQUEST_ACCEPTED':
      return <AcceptedIcon sx={{ fontSize: 16 }} />;
    case 'POST_LIKE':
      return <LikeIcon sx={{ fontSize: 16 }} />;
    case 'POST_COMMENT':
      return <CommentIcon sx={{ fontSize: 16 }} />;
    default:
      return <NotificationsIcon sx={{ fontSize: 16 }} />;
  }
};

// Format time (reuse pattern from PostCard)
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

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Notifications from polling hook
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const notifOpen = Boolean(notifAnchorEl);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  // Handle clicking on a notification
  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    handleNotifClose();

    // Navigate based on notification type
    switch (notification.type) {
      case 'FRIEND_REQUEST':
      case 'FRIEND_REQUEST_ACCEPTED':
        navigate('/friends');
        break;
      case 'POST_LIKE':
      case 'POST_COMMENT':
        navigate('/');  // Post is on the home feed
        break;
      default:
        navigate('/');
    }
  };

  // Search users with debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await api.get(`/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchResults(response.data.data);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const handleSelectUser = (userId) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/profile/${userId}`);
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: '#FFFFFF',
        color: '#050505',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 2 } }}>

        {/* LEFT SECTION — Logo + Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 280 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#1877F2',
              cursor: 'pointer',
              fontFamily: 'Klavika, Segoe UI, Helvetica, Arial, sans-serif',
              lineHeight: 1,
            }}
            onClick={() => navigate('/')}
          >
            f
          </Typography>

          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  bgcolor: '#F0F2F5',
                  borderRadius: 50,
                  px: 2,
                  py: 0.8,
                  width: 240,
                  '&:hover': { bgcolor: '#E4E6EB' },
                }}
              >
                <SearchIcon sx={{ color: '#65676B', fontSize: 20, mr: 1 }} />
                <InputBase
                  placeholder="Search Facebook"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  sx={{
                    fontSize: '0.9rem',
                    color: '#050505',
                    width: '100%',
                    '& ::placeholder': { color: '#65676B' },
                  }}
                />
                {searchLoading && <CircularProgress size={18} sx={{ ml: 1 }} />}
              </Box>

              {showResults && (
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    mt: 1,
                    width: 300,
                    maxHeight: 400,
                    overflowY: 'auto',
                    borderRadius: 2,
                    zIndex: 1300,
                  }}
                >
                  {searchResults.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">No users found</Typography>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {searchResults.map((result) => (
                        <ListItemButton
                          key={result.id}
                          onClick={() => handleSelectUser(result.id)}
                          sx={{ '&:hover': { bgcolor: '#F0F2F5' } }}
                        >
                          <ListItemAvatar>
                            <Avatar src={result.avatar ? `http://localhost:5000${result.avatar}` : undefined} sx={{ bgcolor: '#1877F2' }}>
                              {result.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={result.name}
                            secondary={result.bio || null}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8rem', noWrap: true }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  )}
                </Paper>
              )}
            </Box>
          </ClickAwayListener>
        </Box>

        {/* CENTER SECTION — Navigation tabs */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            flex: 1,
            maxWidth: 600,
            gap: 2,
          }}
        >
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Tooltip title={tab.label} key={tab.label}>
                <Box
                  onClick={() => navigate(tab.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                    py: 1.5,
                    cursor: 'pointer',
                    borderBottom: isActive ? '3px solid #1877F2' : '3px solid transparent',
                    borderRadius: '8px 8px 0 0',
                    color: isActive ? '#1877F2' : '#65676B',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#F0F2F5', borderRadius: 2 },
                  }}
                >
                  {tab.icon}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* RIGHT SECTION — Messenger, Notifications, User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 280, justifyContent: 'flex-end' }}>
          {/* Messenger icon */}
          <Tooltip title="Messenger">
            <IconButton
              sx={{
                bgcolor: '#E4E6EB',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#D8DADF' },
              }}
            >
              <Badge badgeContent={0} color="error">
                <MessengerIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications icon — NOW FUNCTIONAL! */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotifOpen}
              sx={{
                bgcolor: notifOpen ? '#E7F3FF' : '#E4E6EB',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#D8DADF' },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications dropdown */}
          <Menu
            anchorEl={notifAnchorEl}
            open={notifOpen}
            onClose={handleNotifClose}
            PaperProps={{
              elevation: 4,
              sx: { mt: 1.5, width: 360, maxHeight: 500, borderRadius: 2 },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Header */}
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <IconButton size="small" onClick={markAllAsRead} title="Mark all as read">
                  <MarkAllReadIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}
            </Box>
            <Divider />

            {/* Notification list */}
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No notifications yet</Typography>
              </Box>
            ) : (
              <List disablePadding sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  <ListItemButton
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    sx={{
                      bgcolor: notif.read ? 'transparent' : '#F0F8FF',
                      '&:hover': { bgcolor: '#F0F2F5' },
                      borderBottom: '1px solid #F0F2F5',
                    }}
                  >
                    <ListItemAvatar>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={notif.actor?.avatar ? `http://localhost:5000${notif.actor.avatar}` : undefined}
                          sx={{ width: 40, height: 40, bgcolor: '#1877F2' }}
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
                            width: 20,
                            height: 20,
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
                        fontSize: '0.85rem',
                        fontWeight: notif.read ? 400 : 600,
                      }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Menu>

          {/* User avatar — click to open menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
                sx={{ width: 36, height: 36, bgcolor: '#1877F2' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Account dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 200, borderRadius: 2 },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined} sx={{ width: 36, height: 36, bgcolor: '#1877F2' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  See your profile
                </Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Log Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
