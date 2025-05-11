import { Typography, Box, Grid, Card, CardContent, Icon } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';

const features = [
  {
    title: '売上管理',
    description: '売上データの集計・分析が簡単に行えます',
    icon: <MonetizationOnIcon fontSize="large" sx={{ color: '#0C41A0' }} />
  },
  {
    title: 'コスト管理',
    description: '経費の追跡・管理が効率的に行えます',
    icon: <AssessmentIcon fontSize="large" sx={{ color: '#0C41A0' }} />
  },
  {
    title: '成績管理',
    description: '社員のパフォーマンスを評価・管理します',
    icon: <PeopleIcon fontSize="large" sx={{ color: '#0C41A0' }} />
  },
  {
    title: '経理処理',
    description: '会計業務を簡素化・効率化します',
    icon: <ReceiptIcon fontSize="large" sx={{ color: '#0C41A0' }} />
  }
];

const HomePage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box 
        sx={{
          textAlign: 'center',
          mb: 6,
          pb: 4,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight="500">
          Festal てつや 業務システム
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          効率的な業務管理を実現するための統合システム
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
              elevation={2}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h2" fontWeight="500" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage; 