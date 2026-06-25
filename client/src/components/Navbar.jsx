import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem,
  ListItemIcon, Divider
} from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor element
  const open = Boolean(anchorEl);

  // Open the dropdown menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#FFFFFF', color: '#050505', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side — Logo */}
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 'bold', color: '#1877F2', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          facebook
        </Typography>

        {/* Right side — User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* User avatar + name — clickable to open menu */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              cursor: 'pointer', borderRadius: 2, px: 1, py: 0.5,
              '&:hover': { bgcolor: '#F0F2F5' }
            }}
          >
            <Avatar
              src={user?.avatar || undefined}
              sx={{ width: 32, height: 32, bgcolor: '#1877F2' }}
            >
              {/* Show first letter of name if no avatar */}
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
          </Box>

          {/* Dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1, minWidth: 180 }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>
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
