import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Avatar, Typography, Button, Paper, CircularProgress, Alert, Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { userId } = useParams();  // From URL /profile/:userId
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // Determine if viewing own profile or someone else's
  // If no userId in URL, it's the current user's profile
  const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // Fetch user's posts
  useEffect(() => {
    if (profile) {
      fetchUserPosts();
    }
  }, [profile?.id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        // Use /auth/me for own profile (already has counts)
        const response = await api.get('/auth/me');
        setProfile(response.data.data);
      } else {
        // Use /users/:id for other users
        const response = await api.get(`/users/${userId}`);
        setProfile(response.data.data);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const profileId = profile.id;
      const response = await api.get(`/posts?userId=${profileId}`);
      setPosts(response.data.data);
    } catch (err) {
      console.error('Fetch user posts error:', err);
    }
  };

  // Handle profile update from EditProfileModal
  const handleProfileUpdate = (updatedData) => {
    setProfile({ ...profile, ...updatedData });
    // Also update the auth context if it's own profile
    if (isOwnProfile && updateUser) {
      updateUser(updatedData);
    }
  };

  // Handle friend request
  const handleAddFriend = async () => {
    try {
      await api.post(`/friends/request/${profile.id}`);
      setProfile({ ...profile, hasPendingRequest: true });
    } catch (err) {
      console.error('Add friend error:', err);
    }
  };

  // Handle remove friend
  const handleRemoveFriend = async () => {
    try {
      await api.delete(`/friends/${profile.id}`);
      setProfile({ ...profile, isFriend: false });
    } catch (err) {
      console.error('Remove friend error:', err);
    }
  };

  // Handle post deletion
  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

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

  if (error || !profile) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5' }}>
        <Navbar />
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          {error || 'Profile not found'}
        </Alert>
      </Box>
    );
  }

  // Friend count — for own profile use _count, for others use friendCount from API
  const friendCount = isOwnProfile
    ? (profile._count?.friends || 0) + (profile._count?.friendsOf || 0)
    : profile.friendCount || 0;

  const postCount = isOwnProfile
    ? profile._count?.posts || 0
    : profile._count?.posts || 0;

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

      {/* Cover Photo */}
      <Box
        sx={{
          height: 350,
          bgcolor: '#E4E6EB',
          backgroundImage: profile.coverPhoto
            ? `url(http://localhost:5000${profile.coverPhoto})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 8px 8px',
        }}
      />

      {/* Profile Info Section */}
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          px: 2,
          mt: -5,  // Overlap the cover photo slightly
          position: 'relative',
        }}
      >
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mb: 2 }}>
            {/* Avatar — large, overlapping cover */}
            <Avatar
              src={profile.avatar ? `http://localhost:5000${profile.avatar}` : undefined}
              sx={{
                width: 168,
                height: 168,
                bgcolor: '#1877F2',
                fontSize: '4rem',
                border: '5px solid white',
                mt: -10,  // Overlap the cover photo
              }}
            >
              {profile.name?.charAt(0).toUpperCase()}
            </Avatar>

            {/* Name and stats */}
            <Box sx={{ flex: 1, pb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {friendCount} friends · {postCount} posts
              </Typography>
              {profile.bio && (
                <Typography variant="body2" sx={{ mt: 1, color: '#65676B' }}>
                  {profile.bio}
                </Typography>
              )}
            </Box>

            {/* Action button */}
            {isOwnProfile ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditOpen(true)}
                sx={{
                  bgcolor: '#E4E6EB',
                  color: '#050505',
                  '&:hover': { bgcolor: '#D8DADF' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Edit Profile
              </Button>
            ) : profile.isFriend ? (
              <Button
                variant="contained"
                startIcon={<PersonRemoveIcon />}
                onClick={handleRemoveFriend}
                sx={{
                  bgcolor: '#E4E6EB',
                  color: '#050505',
                  '&:hover': { bgcolor: '#D8DADF' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Friends
              </Button>
            ) : profile.hasPendingRequest ? (
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                disabled
                sx={{
                  bgcolor: '#E4E6EB',
                  color: '#65676B',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleAddFriend}
                sx={{
                  bgcolor: '#1877F2',
                  '&:hover': { bgcolor: '#166FE5' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Add Friend
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Intro section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Intro
            </Typography>
            {profile.bio ? (
              <Typography variant="body2" sx={{ textAlign: 'center', color: '#65676B' }}>
                {profile.bio}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ textAlign: 'center', color: '#65676B' }}>
                No bio yet
              </Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1, color: '#65676B' }}>
              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Paper>

        {/* User's Posts */}
        <Box sx={{ mt: 3, pb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Posts
          </Typography>
          {posts.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography color="text.secondary">No posts yet</Typography>
            </Paper>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
              />
            ))
          )}
        </Box>
      </Box>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          user={profile}
          onUpdate={handleProfileUpdate}
        />
      )}
    </Box>
  );
};

export default Profile;
