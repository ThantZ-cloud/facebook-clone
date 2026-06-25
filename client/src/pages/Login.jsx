import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: '#1877F2', fontWeight: 'bold', textAlign: 'center' }}
          >
            GaDone's Hut
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Log in to connect with your friends
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#1877F2',
                '&:hover': { bgcolor: '#166FE5' },
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>
          </Box>

          {/* Register Link */}
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/register"
              sx={{ color: '#1877F2', fontWeight: 'bold' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
