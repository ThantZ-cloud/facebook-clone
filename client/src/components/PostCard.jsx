import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Box, Avatar, Typography, IconButton, Menu, MenuItem, Chip
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon, ThumbUpOffAlt as ThumbUpOffAltIcon,
  ChatBubbleOutlineOutlined as CommentIcon, MoreVert as MoreVertIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CommentSection from './CommentSection';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOwner = user?.id === post.user.id;

  // Format the timestamp into a readable string
  // Example: "2 hours ago", "Just now"
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Toggle like on/off
  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post.id}/like`);
      setLiked(response.data.data.liked);
      setLikeCount(response.data.data.likeCount);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Delete this post
  const handleDelete = async () => {
    setAnchorEl(null); // Close menu
    try {
      await api.delete(`/posts/${post.id}`);
      if (onDelete) onDelete(post.id); // Notify parent to remove from list
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Update comment count when a comment is added/deleted
  const handleCommentCountChange = (change) => {
    setCommentCount(prev => prev + change);
  };

  return (
    <Paper elevation={1} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      {/* Post header: avatar, name, timestamp, menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, pb: 0 }}>
        <Avatar
          src={post.user.avatar ? `http://localhost:5000${post.user.avatar}` : undefined}
          sx={{ bgcolor: '#1877F2', mr: 1.5, cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${post.user.id}`)}
        >
          {post.user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate(`/profile/${post.user.id}`)}
          >
            {post.user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(post.createdAt)}
          </Typography>
        </Box>

        {/* More menu (only for post owner) */}
        {isOwner && (
          <>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Post text content */}
      {post.content && (
        <Typography variant="body1" sx={{ px: 1.5, py: 1, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      )}

      {/* Post image (if exists) */}
      {post.image && (
        <Box sx={{ width: '100%', bgcolor: '#F0F2F5' }}>
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            style={{ width: '100%', display: 'block' }}
          />
        </Box>
      )}

      {/* Like and comment counts */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1.5, py: 1 }}>
        {likeCount > 0 && (
          <Chip
            icon={<ThumbUpIcon sx={{ fontSize: 16 }} />}
            label={`${likeCount}`}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        )}
        {commentCount > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowComments(!showComments)}
          >
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Typography>
        )}
      </Box>

      {/* Action bar: Like + Comment buttons */}
      <Box sx={{ display: 'flex', borderTop: '1px solid #E0E0E0', mx: 1.5 }}>
        <Box
          onClick={handleLike}
          sx={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 1, py: 1, cursor: 'pointer', borderRadius: 1,
            color: liked ? '#1877F2' : '#65676B',
            '&:hover': { bgcolor: '#F0F2F5' }
          }}
        >
          {liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Like</Typography>
        </Box>

        <Box
          onClick={() => setShowComments(!showComments)}
          sx={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 1, py: 1, cursor: 'pointer', borderRadius: 1, color: '#65676B',
            '&:hover': { bgcolor: '#F0F2F5' }
          }}
        >
          <CommentIcon />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Comment</Typography>
        </Box>
      </Box>

      {/* Comment section (expandable) */}
      {showComments && (
        <Box sx={{ px: 1.5, pb: 2, pt: 1, borderTop: '1px solid #E0E0E0' }}>
          <CommentSection postId={post.id} onCommentCountChange={handleCommentCountChange} />
        </Box>
      )}
    </Paper>
  );
};

export default PostCard;
