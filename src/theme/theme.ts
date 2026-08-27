import { createTheme } from '@mui/material/styles'

/**
 * Theme mirrors the existing CSS variables / visual language.
 * Accent teal, soft surfaces, spreadsheet-friendly density.
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5c6570',
    },
    error: {
      main: '#dc2626',
      dark: '#991b1b',
      light: '#fef2f2',
    },
    success: {
      main: '#166534',
      light: '#f0fdf4',
    },
    info: {
      main: '#1d4ed8',
      light: '#eff6ff',
    },
    text: {
      primary: '#15202b',
      secondary: '#5c6570',
    },
    background: {
      default: '#f8fafb',
      paper: '#ffffff',
    },
    divider: '#d8dee6',
  },
  typography: {
    fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: '#15202b',
      lineHeight: 1.25,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#15202b',
    },
    body1: {
      fontSize: '1rem',
      color: '#5c6570',
    },
    body2: {
      fontSize: '0.9rem',
      color: '#5c6570',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minWidth: 320,
          minHeight: '100vh',
          background:
            'linear-gradient(160deg, #eef3f6 0%, #f8fafb 40%, #ffffff 100%)',
        },
        '#root': {
          minHeight: '100vh',
          width: '100%',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          '&.MuiButton-colorPrimary:hover': {
            filter: 'brightness(1.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
})

/** Shared design tokens used in sx props */
export const tokens = {
  surface: '#f4f6f8',
  headerBg: '#f7f9fb',
  gridLine: '#eef1f4',
  border: '#d8dee6',
  rowHover: '#f8fafc',
  accentSoft: 'rgba(15, 118, 110, 0.1)',
  errorSoft: '#fef2f2',
  errorBorder: '#fecaca',
  errorText: '#991b1b',
  sheetMaxHeight: 'min(62vh, 640px)',
} as const
