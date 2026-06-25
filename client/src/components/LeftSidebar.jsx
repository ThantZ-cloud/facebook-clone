import { Box, Avatar, Typography, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LeftSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      {/* User profile link — quick access */}
      <ListItemButton
        onClick={() => navigate('/profile')}
        sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Avatar
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
            sx={{ width: 28, height: 28 }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={user?.name}
          primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
        />
      </ListItemButton>

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
