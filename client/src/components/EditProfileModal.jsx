import { useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Avatar, Typography, IconButton, Alert, CircularProgress
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Close as CloseIcon } from '@mui/icons-material';
import api from '../services/api';

const EditProfileModal = ({ open, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // File refs for avatar and cover photo uploads
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Save profile changes (name, bio)
  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.put('/users/me', {
        name: name.trim(),
        bio: bio.trim() || null
      });

      // Notify parent about the update
      if (onUpdate) onUpdate(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar image
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Notify parent about avatar change
      if (onUpdate) onUpdate(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading avatar');
    }
  };

  // Upload cover photo
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cover', file);

    try {
      const response = await api.post('/users/me/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Notify parent about cover photo change
      if (onUpdate) onUpdate(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading cover photo');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Profile
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Cover Photo Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cover Photo
          </Typography>
          <Box
            sx={{
              height: 150,
              borderRadius: 2,
              bgcolor: '#E4E6EB',
              overflow: 'hidden',
              position: 'relative',
              backgroundImage: user?.coverPhoto
                ? `url(http://localhost:5000${user.coverPhoto})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <IconButton
              onClick={() => coverInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
              size="small"
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </Box>

        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
              sx={{ width: 80, height: 80, bgcolor: '#1877F2', fontSize: '2rem' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              onClick={() => avatarInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
              size="small"
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Click the camera icon to change your photo
          </Typography>
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </Box>

        {/* Name Field */}
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />

        {/* Bio Field */}
        <TextField
          fullWidth
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          margin="normal"
          multiline
          rows={3}
          placeholder="Write something about yourself..."
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            bgcolor: '#1877F2',
            '&:hover': { bgcolor: '#166FE5' },
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
