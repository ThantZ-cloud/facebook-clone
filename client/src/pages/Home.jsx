import { useState, useEffect } from 'react';
import { Container, Box, CircularProgress, Typography, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when the page loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.data);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Called when a new post is created (from CreatePost component)
  const handlePostCreated = (newPost) => {
    // Add the new post to the top of the list
    setPosts([newPost, ...posts]);
  };

  // Called when a post is deleted (from PostCard component)
  const handlePostDeleted = (postId) => {
    // Remove the deleted post from the list
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5' }}>
      {/* Top navigation bar */}
      <Navbar />

      {/* Main content area */}
      <Container maxWidth="sm" sx={{ pt: 3, pb: 4 }}>
        {/* Create post form */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error message */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Loading spinner */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          /* Empty state — no posts yet */
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share something!
            </Typography>
          </Box>
        ) : (
          /* List of posts */
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDeleted}
            />
          ))
        )}
      </Container>
    </Box>
  );
};

export default Home;
