import { useState, useRef } from 'react';
import {
  Paper, Box, Avatar, TextField, Button, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);     // The actual File object
  const [imagePreview, setImagePreview] = useState(null); // URL for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Reference to hidden file input

  // Open the create post dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Close dialog and reset form
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setContent('');
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  // When user selects an image file
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    setError(null);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  // Submit the post
  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) {
      setError('Please write something or add an image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use FormData because we're sending a file
      // FormData is a browser API for building multipart/form-data requests
      const formData = new FormData();
      if (content.trim()) formData.append('content', content.trim());
      if (imageFile) formData.append('image', imageFile);

      const response = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Notify parent component about the new post
      if (onPostCreated) {
        onPostCreated(response.data.data);
      }

      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* The "What's on your mind?" prompt card */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
            sx={{ bgcolor: '#1877F2' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <TextField
            fullWidth
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            onClick={handleOpenDialog}
            InputProps={{
              readOnly: true, // Make it look clickable, not editable
              sx: {
                borderRadius: 5, bgcolor: '#F0F2F5', cursor: 'pointer',
                '& fieldset': { border: 'none' }
              }
            }}
          />
        </Box>
      </Paper>

      {/* The create post dialog (modal) */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pb: 0 }}>
          Create Post
        </DialogTitle>

        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* User info + text area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined} sx={{ bgcolor: '#1877F2' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2">{user?.name}</Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{ mb: 2 }}
          />

          {/* Image preview (if image selected) */}
          {imagePreview && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%', maxHeight: 300, objectFit: 'cover',
                  borderRadius: 8
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute', top: 8, right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Add image button */}
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid #E0E0E0', borderRadius: 2, p: 1.5, cursor: 'pointer',
              '&:hover': { bgcolor: '#F0F2F5' }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Add to your post
            </Typography>
            <IconButton component="span" sx={{ color: '#45BD62' }}>
              <PhotoCameraIcon />
            </IconButton>
          </Box>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            style={{ display: 'none' }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (!content.trim() && !imageFile)}
            sx={{
              bgcolor: '#1877F2', '&:hover': { bgcolor: '#166FE5' },
              textTransform: 'none', fontWeight: 600, borderRadius: 2
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePost;
