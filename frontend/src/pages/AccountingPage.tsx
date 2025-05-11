import { Typography, Box, Card, CardContent, Grid, Button } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const AccountingPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <AccountBalanceIcon sx={{ fontSize: 32, color: '#0C41A0', mr: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="500">
          経理部
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        経理部門の業務管理画面です。財務データの閲覧、経費申請の承認、経理業務の効率化ツールにアクセスできます。
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }} elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                会計処理
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                月次・四半期・年次の会計処理を行います
              </Typography>
              <Button variant="outlined" color="primary">
                詳細を見る
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }} elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                経費申請
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                経費申請の確認・承認を行います
              </Typography>
              <Button variant="outlined" color="primary">
                詳細を見る
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }} elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                財務レポート
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                財務状況のレポートを確認します
              </Typography>
              <Button variant="outlined" color="primary">
                詳細を見る
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountingPage; 