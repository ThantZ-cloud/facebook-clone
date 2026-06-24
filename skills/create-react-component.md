# Create React Component

## Purpose
Quickly create a React component with MUI styling, state management, and API integration.

## When to Use
- Building new UI components
- Creating page components
- Adding reusable UI elements

## Steps

### 1. Gather Requirements
Ask user:
- Component name
- What it displays
- Props it receives
- API calls needed?
- MUI components to use

### 2. Create Component File
```jsx
// client/src/components/{ComponentName}.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import api from '../services/api';

const {ComponentName} = ({ prop1, prop2 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/endpoint');
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">{prop1}</Typography>
      {/* Component content */}
    </Paper>
  );
};

export default {ComponentName};
```

### 3. Add to Parent Component or Route
```jsx
// In App.jsx or parent page
import {ComponentName} from './components/{ComponentName}';

<{ComponentName} prop1="value" prop2={data} />
```

## MUI Components Cheat Sheet
- Layout: `Box`, `Stack`, `Grid`, `Container`
- Content: `Typography`, `Avatar`, `Chip`, `Divider`
- Actions: `Button`, `IconButton`, `Fab`
- Inputs: `TextField`, `Select`, `Checkbox`, `Switch`
- Surfaces: `Paper`, `Card`, `AppBar`, `Toolbar`
- Feedback: `CircularProgress`, `Alert`, `Snackbar`

## Facebook Color Palette
```jsx
const colors = {
  primary: '#1877F2',    // Facebook blue
  background: '#F0F2F5', // Light gray
  paper: '#FFFFFF',       // White
  text: '#050505',        // Almost black
  secondary: '#65676B',   // Gray text
  success: '#42B72A',     // Green
  error: '#FA383E',       // Red
};
```

## Output
- Component file with proper structure
- MUI styling
- API integration if needed
- Loading and error states
