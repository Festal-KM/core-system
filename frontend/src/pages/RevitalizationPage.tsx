import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
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

const RevitalizationPage = () => {
  return (
    <>
      <SectionHeader
        icon={<PublicIcon sx={{ fontSize: 40 }} />}
        title="地方創生事業部"
        subtitle="地方創生事業部のコンテンツはここに表示されます。"
      />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                地域プロジェクト
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                地域活性化プロジェクトの管理・推進を行います
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
                連携自治体
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                自治体との連携・調整を行います
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
                地方レポート
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                地方創生活動のレポートを確認します
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

export default RevitalizationPage; 