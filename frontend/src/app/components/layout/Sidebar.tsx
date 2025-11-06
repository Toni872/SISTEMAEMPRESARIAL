import React from 'react'
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
} from '@mui/material'
import {
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    ShoppingCart as SalesIcon,
    LocalShipping as PurchaseIcon,
    AccountBalance as AccountingIcon,
    People as PeopleIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 240

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Productos', icon: <InventoryIcon />, path: '/inventory/products' },
    { text: 'Ventas', icon: <SalesIcon />, path: '/sales' },
    { text: 'Compras', icon: <PurchaseIcon />, path: '/purchase' },
    { text: 'Contabilidad', icon: <AccountingIcon />, path: '/accounting' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
]

export const Sidebar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleNavigation = (path: string) => {
        navigate(path)
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}