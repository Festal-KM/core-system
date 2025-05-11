import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SectionHeader from '../components/SectionHeader';

const cardActionSx = {
  position: 'absolute',
  right: 16,
  bottom: 16,
  transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
  color: 'primary.main',
  '&:hover': {
    transform: 'translateX(8px) scale(1.15)',
    color: 'primary.dark',
    background: 'transparent',
  },
};

const cardSx = {
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  p: 2,
};

const ConsultingPage = () => {
  return (
    <>
      <SectionHeader
        icon={<BusinessIcon sx={{ fontSize: 40 }} />}
        title="コンサル事業部"
        subtitle="コンサル事業部のコンテンツはここに表示されます。"
      />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                顧客提案
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                顧客へのコンサル提案・管理を行います
              </Typography>
            </CardContent>
            <IconButton sx={cardActionSx}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                プロジェクト管理
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                コンサル案件の進捗・管理を行います
              </Typography>
            </CardContent>
            <IconButton sx={cardActionSx}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                コンサルレポート
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                コンサル活動のレポートを確認します
              </Typography>
            </CardContent>
            <IconButton sx={cardActionSx}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ConsultingPage; 