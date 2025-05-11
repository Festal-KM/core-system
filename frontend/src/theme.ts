import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#222',
      light: '#666',
      dark: '#000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f5f5f5',
      contrastText: '#222',
    },
    background: {
      default: '#fafbfc',
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#666',
      disabled: '#aaa',
    },
    divider: '#e0e0e0',
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 8px 0 rgba(0,0,0,0.04)',
    '0 4px 16px 0 rgba(0,0,0,0.08)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)',
    '0 8px 32px 0 rgba(0,0,0,0.10)'
  ],
  typography: {
    fontFamily: [
      'Noto Sans JP',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    allVariants: {
      color: '#222',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
          color: '#fff',
          borderTopRightRadius: 18,
          borderBottomRightRadius: 18,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e0e0e0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 0',
          transition: 'background 0.2s, box-shadow 0.2s',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#fff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme; 