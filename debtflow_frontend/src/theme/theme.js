import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1565C0',      // azul financiero
            light: '#1E88E5',
            dark: '#0D47A1',
        },
        secondary: {
            main: '#00897B',      // verde cobranzas
        },
        error: {
            main: '#C62828',
        },
        warning: {
            main: '#F57F17',
        },
        success: {
            main: '#2E7D32',
        },
        background: {
            default: '#F5F6FA',
            paper: '#FFFFFF',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 500 }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }
            }
        }
    }
})

export default theme