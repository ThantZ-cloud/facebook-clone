import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Avatar, Button, Tabs, Tab, CircularProgress, Alert,
  TextField, InputAdornment
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  PersonRemove as PersonRemoveIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Friends = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);          // 0 = Requests, 1 = All Friends, 2 = Find Friends
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find Friends state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState(new Set()); // Track which users we've sent requests to

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, friendsRes] = await Promise.all([
        api.get('/friends/requests'),
        api.get('/friends')
      ]);
      setRequests(requestsRes.data.data);
      setFriends(friendsRes.data.data);
    } catch (err) {
      setError('Failed to load friends data');
      console.error('Friends fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults(response.data.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Send friend request from search results
  const handleSendRequest = async (userId) => {
    try {
      await api.post(`/friends/request/${userId}`);
      setSentRequests(prev => new Set([...prev, userId]));
    } catch (err) {
      console.error('Send request error:', err);
    }
  };

  // Accept a friend request
  const handleAccept = async (requestId) => {
    try {
      await api.put(`/friends/request/${requestId}`, { status: 'ACCEPTED' });
      setRequests(requests.filter(r => r.id !== requestId));
      const friendsRes = await api.get('/friends');
      setFriends(friendsRes.data.data);
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  // Reject a friend request
  const handleReject = async (requestId) => {
    try {
      await api.put(`/friends/request/${requestId}`, { status: 'REJECTED' });
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  // Remove a friend
  const handleRemove = async (friendId) => {
    try {
      await api.delete(`/friends/${friendId}`);
      setFriends(friends.filter(f => f.id !== friendId));
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  // Check if a user is already a friend
  const isFriend = (userId) => friends.some(f => f.id === userId);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5' }}>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5' }}>
      <Navbar />

      {/* Back button */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, pt: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            color: '#65676B',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#F0F2F5' },
          }}
        >
          Back to Home
        </Button>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Friends
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Tabs */}
        <Paper elevation={1} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: '#1877F2' },
              '& .MuiTabs-indicator': { bgcolor: '#1877F2' }
            }}
          >
            <Tab label={`Friend Requests (${requests.length})`} />
            <Tab label={`All Friends (${friends.length})`} />
            <Tab label="Find Friends" />
          </Tabs>
        </Paper>

        {/* Tab 0: Friend Requests */}
        {tab === 0 && (
          <Box>
            {requests.length === 0 ? (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography color="text.secondary">No pending friend requests</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                {requests.map((request) => (
                  <Paper key={request.id} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Box
                      onClick={() => navigate(`/profile/${request.sender.id}`)}
                      sx={{ cursor: 'pointer', mb: 1.5 }}
                    >
                      <Avatar
                        src={request.sender.avatar ? `http://localhost:5000${request.sender.avatar}` : undefined}
                        sx={{ width: 80, height: 80, bgcolor: '#1877F2', fontSize: '2rem', mx: 'auto', mb: 1 }}
                      >
                        {request.sender.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {request.sender.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => handleAccept(request.id)}
                        sx={{ bgcolor: '#1877F2', '&:hover': { bgcolor: '#166FE5' }, textTransform: 'none', fontWeight: 600 }}
                      >
                        Confirm
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CloseIcon />}
                        onClick={() => handleReject(request.id)}
                        sx={{ bgcolor: '#E4E6EB', color: '#050505', '&:hover': { bgcolor: '#D8DADF' }, textTransform: 'none', fontWeight: 600 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 1: All Friends */}
        {tab === 1 && (
          <Box>
            {friends.length === 0 ? (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography color="text.secondary">No friends yet</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                {friends.map((friend) => (
                  <Paper key={friend.id} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Box
                      onClick={() => navigate(`/profile/${friend.id}`)}
                      sx={{ cursor: 'pointer', mb: 1.5 }}
                    >
                      <Avatar
                        src={friend.avatar ? `http://localhost:5000${friend.avatar}` : undefined}
                        sx={{ width: 80, height: 80, bgcolor: '#1877F2', fontSize: '2rem', mx: 'auto', mb: 1 }}
                      >
                        {friend.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {friend.name}
                      </Typography>
                      {friend.bio && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                          {friend.bio}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PersonRemoveIcon />}
                      onClick={() => handleRemove(friend.id)}
                      sx={{ bgcolor: '#E4E6EB', color: '#050505', '&:hover': { bgcolor: '#D8DADF' }, textTransform: 'none', fontWeight: 600 }}
                    >
                      Remove
                    </Button>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: Find Friends */}
        {tab === 2 && (
          <Box>
            {/* Search bar */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search people by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#65676B' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 50, bgcolor: '#F0F2F5', '& fieldset': { border: 'none' } }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={searchLoading || !searchQuery.trim()}
                  sx={{
                    bgcolor: '#1877F2',
                    '&:hover': { bgcolor: '#166FE5' },
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 3
                  }}
                >
                  {searchLoading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </Box>
            </Paper>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                {searchResults.map((result) => (
                  <Paper key={result.id} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Box
                      onClick={() => navigate(`/profile/${result.id}`)}
                      sx={{ cursor: 'pointer', mb: 1.5 }}
                    >
                      <Avatar
                        src={result.avatar ? `http://localhost:5000${result.avatar}` : undefined}
                        sx={{ width: 80, height: 80, bgcolor: '#1877F2', fontSize: '2rem', mx: 'auto', mb: 1 }}
                      >
                        {result.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {result.name}
                      </Typography>
                      {result.bio && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                          {result.bio}
                        </Typography>
                      )}
                    </Box>

                    {/* Action button based on relationship status */}
                    {isFriend(result.id) ? (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckIcon />}
                        disabled
                        sx={{ bgcolor: '#E4E6EB', color: '#65676B', textTransform: 'none', fontWeight: 600 }}
                      >
                        Already Friends
                      </Button>
                    ) : sentRequests.has(result.id) ? (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckIcon />}
                        disabled
                        sx={{ bgcolor: '#E4E6EB', color: '#65676B', textTransform: 'none', fontWeight: 600 }}
                      >
                        Request Sent
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleSendRequest(result.id)}
                        sx={{ bgcolor: '#1877F2', '&:hover': { bgcolor: '#166FE5' }, textTransform: 'none', fontWeight: 600 }}
                      >
                        Add Friend
                      </Button>
                    )}
                  </Paper>
                ))}
              </Box>
            )}

            {/* Empty state */}
            {searchQuery && !searchLoading && searchResults.length === 0 && (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography color="text.secondary">No users found</Typography>
              </Paper>
            )}

            {/* Initial state */}
            {!searchQuery && searchResults.length === 0 && (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography color="text.secondary">Search for people by name to add them as friends</Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Friends;
