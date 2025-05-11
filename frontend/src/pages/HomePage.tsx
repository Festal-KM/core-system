import { Typography, Box, Grid, Card, CardContent, Icon, Fade, Grow } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useEffect, useState } from 'react';

const features = [
  {
    title: '売上管理',
    description: '売上データの集計・分析が簡単に行えます',
    icon: <MonetizationOnIcon fontSize="large" sx={{ color: '#2563eb' }} />
  },
  {
    title: 'コスト管理',
    description: '経費の追跡・管理が効率的に行えます',
    icon: <AssessmentIcon fontSize="large" sx={{ color: '#2563eb' }} />
  },
  {
    title: '成績管理',
    description: '社員のパフォーマンスを評価・管理します',
    icon: <PeopleIcon fontSize="large" sx={{ color: '#2563eb' }} />
  },
  {
    title: '経理処理',
    description: '会計業務を簡素化・効率化します',
    icon: <ReceiptIcon fontSize="large" sx={{ color: '#2563eb' }} />
  }
];

const HomePage = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(120deg, #f5f7fa 0%, #e0e7ef 100%)' }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        {features.map((feature, index) => (
          <Grow in={show} style={{ transformOrigin: '0 0 0' }} timeout={500 + index * 200} key={index}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s',
                  boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)',
                  border: '1.5px solid #e0e7ef',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(2px)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.04)',
                    boxShadow: '0 16px 40px 0 rgba(37,99,235,0.18)',
                    borderColor: '#60a5fa',
                  }
                }}
                elevation={0}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h2" fontWeight="500" gutterBottom sx={{ letterSpacing: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grow>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage; 