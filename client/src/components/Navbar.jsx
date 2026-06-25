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
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Navigation tabs in the center of the navbar
// Only showing features that are built in this version
const navTabs = [
  { icon: <HomeIcon />, label: 'Home', path: '/' },
  { icon: <PersonIcon />, label: 'Profile', path: '/profile' },
  { icon: <FriendsIcon />, label: 'Friends', path: '/friends' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  // Search users with debounce (wait 300ms after typing stops)
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

  // Navigate to a user's profile and close search
  const handleSelectUser = (userId) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/profile/${userId}`);
  };

  // Close search dropdown when clicking outside
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
          {/* Facebook logo */}
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

          {/* Search bar — now functional! */}
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

              {/* Search results dropdown */}
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
                      <Typography variant="body2" color="text.secondary">
                        No users found
                      </Typography>
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
                            <Avatar
                              src={result.avatar ? `http://localhost:5000${result.avatar}` : undefined}
                              sx={{ bgcolor: '#1877F2' }}
                            >
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
                    '&:hover': {
                      bgcolor: '#F0F2F5',
                      borderRadius: 2,
                    },
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

          {/* Notifications icon */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                bgcolor: '#E4E6EB',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#D8DADF' },
              }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

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

          {/* Dropdown menu */}
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
            {/* User info at top of menu */}
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
