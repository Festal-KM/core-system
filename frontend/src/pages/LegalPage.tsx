import { Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
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

const LegalPage = () => {
  return (
    <>
      <SectionHeader
        icon={<GavelIcon sx={{ fontSize: 40 }} />}
        title="法務"
        subtitle="法務部門の業務管理画面です。契約書の管理、法務相談、コンプライアンス関連の業務にアクセスできます。"
      />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardSx} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                契約書管理
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                契約書の作成・管理・更新を行います
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
                法務相談
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                法務に関する相談・確認を行います
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
                コンプライアンス
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
                コンプライアンス関連の業務を行います
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

export default LegalPage; 