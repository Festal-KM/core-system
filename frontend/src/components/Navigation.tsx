import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

type NavItem = {
  text: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { text: 'ホーム', path: '/', icon: <HomeIcon /> },
  {
    text: 'バックオフィス',
    icon: <BusinessCenterIcon />,
    children: [
      { text: '経理', path: '/accounting', icon: <AccountBalanceIcon /> },
      { text: '法務', path: '/legal', icon: <GavelIcon /> },
      { text: '労務', path: '/hr', icon: <WorkIcon /> },
      { text: '人事', path: '/personnel', icon: <PeopleIcon /> }
    ]
  },
  {
    text: '事業部',
    icon: <BusinessIcon />,
    children: [
      { text: '営業部', path: '/sales', icon: <TrendingUpIcon /> },
      { text: 'コンサル事業部', path: '/consulting', icon: <BusinessIcon /> },
      { text: '地方創生事業部', path: '/revitalization', icon: <PublicIcon /> }
    ]
  }
];

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setOpen(false);
  };

  const handleExpandClick = (text: string) => {
    setExpandedItems(prev => 
      prev.includes(text) 
        ? prev.filter(item => item !== text)
        : [...prev, text]
    );
  };

  const renderNavItem = (item: NavItem, level: number = 0, themeArg = theme) => {
    const isExpanded = expandedItems.includes(item.text);
    const isSelected = location.pathname === item.path;

    return (
      <Box key={item.text}>
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected}
            onClick={() => item.path ? handleNavigation(item.path) : handleExpandClick(item.text)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: level * 2 + 2.5,
              color: '#222 !important',
              '& .MuiListItemText-root, & .MuiTypography-root': {
                color: '#222 !important',
              },
              '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'rgba(0,0,0,0.08)',
                color: '#222 !important',
                '& .MuiListItemIcon-root': {
                  color: '#222 !important',
                },
                '& .MuiListItemText-root, & .MuiTypography-root': {
                  color: '#222 !important',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: '#222',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary={item.text} primaryTypographyProps={{ sx: { color: '#222', fontWeight: isSelected ? 700 : 400 } }} />
                {item.children && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
              </>
            )}
          </ListItemButton>
        </ListItem>
        {item.children && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderNavItem(child, level + 1, themeArg))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        color: 'white',
        padding: theme.spacing(0, 1)
      }}>
        <Typography variant="h6" noWrap component="div">
          FAM
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {navItems.map(item => renderNavItem(item, 0, theme))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: open ? drawerWidth : 64 }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={isMobile && open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#e0e0e0',
            color: '#222',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: open ? drawerWidth : 64,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            background: '#e0e0e0',
            color: '#222',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navigation; 