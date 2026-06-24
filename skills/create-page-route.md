# Create Page & Route

## Purpose
Create a new page component with React Router integration.

## When to Use
- Adding new pages to the app
- Creating protected routes
- Setting up navigation

## Steps

### 1. Gather Requirements
Ask user:
- Page name
- Route path (e.g., /profile/:id)
- Protected? (requires login)
- Layout needed? (navbar, sidebar)

### 2. Create Page Component
```jsx
// client/src/pages/{PageName}.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import api from '../services/api';

const {PageName} = () => {
  const { id } = useParams(); // if dynamic route
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/endpoint/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">{PageName}</Typography>
        {/* Page content */}
      </Box>
    </Container>
  );
};

export default {PageName};
```

### 3. Add Route to App.jsx
```jsx
// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {PageName} from './pages/{PageName}';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/{page}" element={<{PageName} />} />
          <Route path="/{page}/:id" element={<{PageName} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 4. Create ProtectedRoute Component (if not exists)
```jsx
// client/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

### 5. Add Navigation Link
```jsx
// In Navbar.jsx
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

<Link component={RouterLink} to="/{page}">
  {PageName}
</Link>
```

## Common Route Patterns
| Pattern | Example |
|---------|---------|
| Static | `/about` |
| Dynamic | `/profile/:id` |
| Nested | `/messages/:conversationId` |
| Optional | `/settings?tab=profile` |

## Output
- Page component file
- Route configuration in App.jsx
- ProtectedRoute if needed
- Navigation link in Navbar
