import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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

const AccountingPage = () => {
  return (
    <>
      <SectionHeader
        icon={<AccountBalanceIcon sx={{ fontSize: 40 }} />}
        title="経理"
        subtitle="経理部門の業務管理画面です。財務データの閲覧、経費申請の承認、経理業務の効率化ツールにアクセスできます。"
      />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                会計処理
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                月次・四半期・年次の会計処理を行います
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
                経費申請
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                経費申請の確認・承認を行います
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
                財務レポート
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                財務状況のレポートを確認します
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

export default AccountingPage; 