import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, InputBase, IconButton, Menu, MenuItem, ListItemAvatar
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreHoriz as MoreIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import api from '../services/api';

const RightSidebar = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends');
      setFriends(response.data.data);
    } catch (err) {
      console.error('Fetch friends for sidebar:', err);
    }
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Friends List header */}
      <Box sx={{ px: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Friends List
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* "..." more menu */}
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, minWidth: 180 }
              }}
            >
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/friends'); }}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                View All Friends
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Search friends */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#F0F2F5',
            borderRadius: 50,
            px: 1.5,
            py: 0.5,
            mb: 1,
          }}
        >
          <SearchIcon sx={{ color: '#65676B', fontSize: 18, mr: 0.5 }} />
          <InputBase
            placeholder="Search friends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              fontSize: '0.85rem',
              color: '#050505',
              width: '100%',
              '& ::placeholder': { color: '#65676B' },
            }}
          />
        </Box>
      </Box>

      {/* Friend list */}
      {filteredFriends.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          {friends.length === 0 ? 'No friends yet' : 'No matches found'}
        </Typography>
      ) : (
        <List disablePadding sx={{ px: 1 }}>
          {filteredFriends.map((friend) => (
            <ListItemButton
              key={friend.id}
              onClick={() => navigate(`/profile/${friend.id}`)}
              sx={{
                borderRadius: 2,
                mb: 0.3,
                '&:hover': { bgcolor: '#F0F2F5' },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  src={friend.avatar ? `http://localhost:5000${friend.avatar}` : undefined}
                  sx={{ width: 32, height: 32, bgcolor: '#1877F2', fontSize: '0.85rem' }}
                >
                  {friend.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RightSidebar;
