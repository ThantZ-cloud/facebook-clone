import { createTheme } from '@mui/material/styles';

// Facebook's color palette
// By defining colors here, we can change them in ONE place
// instead of hunting through every component
const theme = createTheme({
  palette: {
    primary: {
      main: '#1877F2',      // Facebook Blue — buttons, links, accents
      dark: '#166FE5',      // Darker blue — hover states
      light: '#E7F3FF',     // Light blue — selected states, highlights
    },
    secondary: {
      main: '#42B72A',      // Facebook Green — success, "Sign Up" button
      dark: '#36A420',      // Darker green — hover
    },
    background: {
      default: '#F0F2F5',   // Light gray — page background
      paper: '#FFFFFF',     // White — cards, modals, sidebars
    },
    text: {
      primary: '#050505',   // Almost black — main text
      secondary: '#65676B', // Gray — timestamps, subtitles
    },
    error: {
      main: '#FA383E',      // Red — errors, delete actions
    },
    divider: '#E4E6EB',     // Light gray — borders, separators
  },

  typography: {
    // Facebook uses a clean sans-serif font
    fontFamily: [
      'Segoe UI',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    // Slightly bolder headings
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
  },

  // Override default MUI component styles to match Facebook
  components: {
    // Buttons — no uppercase, rounded corners
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',     // Facebook doesn't use ALL CAPS
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    // Cards/Papers — subtle shadow, rounded corners
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // Avatar — default blue background
    MuiAvatar: {
      styleOverrides: {
        root: {
          bgcolor: '#1877F2',
        },
      },
    },
    // TextFields — rounded, light background
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 20,
            backgroundColor: '#F0F2F5',
          },
        },
      },
    },
  },
});

export default theme;
