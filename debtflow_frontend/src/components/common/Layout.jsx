import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Box, Drawer, AppBar, Toolbar, Typography, List,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Divider, Avatar
} from '@mui/material'
import DashboardIcon    from '@mui/icons-material/Dashboard'
import PeopleIcon       from '@mui/icons-material/People'
import ReceiptLongIcon  from '@mui/icons-material/ReceiptLong'
import MenuIcon         from '@mui/icons-material/Menu'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

const DRAWER_WIDTH = 240

const NAV_ITEMS = [
    { label: 'Dashboard',  path: '/',        icon: <DashboardIcon /> },
    { label: 'Clientes',   path: '/clients', icon: <PeopleIcon /> },
    { label: 'Deudas',     path: '/debts',   icon: <ReceiptLongIcon /> },
]

export default function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate  = useNavigate()
    const location  = useLocation()

    const drawer = (
        <Box>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6" color="primary" fontWeight={700}>
                    DebtFlow
                </Typography>
            </Box>
            <Divider />
            <List>
                {NAV_ITEMS.map(item => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path)
                                setMobileOpen(false)
                            }}
                            sx={{
                                mx: 1, borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': { color: 'white' },
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar móvil */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    display: { sm: 'none' },
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar>
                    <IconButton onClick={() => setMobileOpen(true)} color="primary">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                        DebtFlow
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar móvil */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{ display: { sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
            >
                {drawer}
            </Drawer>

            {/* Sidebar desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        border: 'none',
                        boxShadow: '2px 0 12px rgba(0,0,0,0.06)'
                    }
                }}
                open
            >
                {drawer}
            </Drawer>

            {/* Contenido principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: { xs: 8, sm: 0 },
                    ml: { sm: `${DRAWER_WIDTH}px` },
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                {children}
            </Box>
        </Box>
    )
}