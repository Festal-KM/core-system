import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
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

const HRPage = () => {
  return (
    <>
      <SectionHeader
        icon={<WorkIcon sx={{ fontSize: 40 }} />}
        title="労務"
        subtitle="労務部門の業務管理画面です。勤怠管理、給与計算、社会保険関連の業務にアクセスできます。"
      />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                勤怠管理
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                出退勤・休暇の管理を行います
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
                給与計算
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                給与計算・支払い管理を行います
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
                社会保険
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                社会保険関連の手続きを行います
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

export default HRPage; 