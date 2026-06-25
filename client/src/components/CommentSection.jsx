import { useState, useEffect } from 'react';
import { Box, Avatar, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import { Send as SendIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CommentSection = ({ postId, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data.data);
    } catch (err) {
      console.error('Fetch comments error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content: newComment.trim()
      });

      // Add the new comment to the list
      setComments([...comments, response.data.data]);
      setNewComment('');

      // Notify parent about the new comment
      if (onCommentCountChange) onCommentCountChange(1);
    } catch (err) {
      console.error('Add comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a comment
  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));

      // Notify parent about the deleted comment
      if (onCommentCountChange) onCommentCountChange(-1);
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  // Format timestamp (same pattern as PostCard)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box>
      {/* List of existing comments */}
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Avatar
            src={comment.user.avatar || undefined}
            sx={{ width: 32, height: 32, bgcolor: '#1877F2', mt: 0.5 }}
          >
            {comment.user.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            {/* Comment bubble */}
            <Box sx={{ bgcolor: '#F0F2F5', borderRadius: 2, px: 1.5, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                {comment.user.name}
              </Typography>
              <Typography variant="body2">{comment.content}</Typography>
            </Box>

            {/* Timestamp + delete button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
              <Typography variant="caption" color="text.secondary">
                {formatTime(comment.createdAt)}
              </Typography>
              {comment.user.id === user?.id && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(comment.id)}
                  sx={{ p: 0.3 }}
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      ))}

      {/* Add comment form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Avatar
          src={user?.avatar || undefined}
          sx={{ width: 32, height: 32, bgcolor: '#1877F2' }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: 5, bgcolor: '#F0F2F5',
              '& fieldset': { border: 'none' }
            },
            endAdornment: (
              <IconButton
                type="submit"
                size="small"
                disabled={!newComment.trim() || submitting}
                sx={{ color: '#1877F2' }}
              >
                {submitting ? <CircularProgress size={18} /> : <SendIcon fontSize="small" />}
              </IconButton>
            )
          }}
        />
      </Box>
    </Box>
  );
};

export default CommentSection;
