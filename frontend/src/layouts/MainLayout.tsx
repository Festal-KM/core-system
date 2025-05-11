import { Outlet } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import Navigation from '../components/Navigation';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navigation />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3,
        transition: (theme) => theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            height: 'calc(100vh - 48px)',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default MainLayout; 