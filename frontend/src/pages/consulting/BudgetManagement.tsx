import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SectionHeader from '../../components/SectionHeader';
import { useNavigate } from 'react-router-dom';

// 予算項目の型定義
interface BudgetItem {
  id: number;
  name: string;
  targetAmount: number;
  actualAmount: number;
  ratio: number;
  category: '売上' | '原価' | 'その他';
  fiscalYear: number;
  fiscalQuarter: number;
}

// 予算ダッシュボードの概要データ型
interface BudgetSummary {
  totalTargetAmount: number;
  totalActualAmount: number;
  achievementRate: number;
  quarterlyData: {
    quarter: number;
    target: number;
    actual: number;
    rate: number;
  }[];
}

// ダミー予算項目データ
const mockBudgetItems: BudgetItem[] = [
  {
    id: 1,
    name: 'コンサルティングプロジェクト収入',
    targetAmount: 20000000,
    actualAmount: 18500000,
    ratio: 92.5,
    category: '売上',
    fiscalYear: 2023,
    fiscalQuarter: 1
  },
  {
    id: 2,
    name: '研修サービス収入',
    targetAmount: 5000000,
    actualAmount: 4800000,
    ratio: 96.0,
    category: '売上',
    fiscalYear: 2023,
    fiscalQuarter: 1
  },
  {
    id: 3,
    name: '人件費',
    targetAmount: 10000000,
    actualAmount: 9800000,
    ratio: 98.0,
    category: '原価',
    fiscalYear: 2023,
    fiscalQuarter: 1
  },
  {
    id: 4,
    name: '外注費',
    targetAmount: 3000000,
    actualAmount: 2700000,
    ratio: 90.0,
    category: '原価',
    fiscalYear: 2023,
    fiscalQuarter: 1
  },
  {
    id: 5,
    name: '設備投資',
    targetAmount: 1000000,
    actualAmount: 980000,
    ratio: 98.0,
    category: 'その他',
    fiscalYear: 2023,
    fiscalQuarter: 1
  },
  {
    id: 6,
    name: 'コンサルティングプロジェクト収入',
    targetAmount: 22000000,
    actualAmount: 21000000,
    ratio: 95.5,
    category: '売上',
    fiscalYear: 2023,
    fiscalQuarter: 2
  },
  {
    id: 7,
    name: '研修サービス収入',
    targetAmount: 5500000,
    actualAmount: 5300000,
    ratio: 96.4,
    category: '売上',
    fiscalYear: 2023,
    fiscalQuarter: 2
  },
];

// ダミー予算概要データを生成する関数
const generateBudgetSummary = (items: BudgetItem[]): BudgetSummary => {
  const summary: BudgetSummary = {
    totalTargetAmount: 0,
    totalActualAmount: 0,
    achievementRate: 0,
    quarterlyData: []
  };

  // 総計の計算
  summary.totalTargetAmount = items.reduce((sum, item) => sum + item.targetAmount, 0);
  summary.totalActualAmount = items.reduce((sum, item) => sum + item.actualAmount, 0);
  summary.achievementRate = summary.totalTargetAmount > 0 
    ? parseFloat(((summary.totalActualAmount / summary.totalTargetAmount) * 100).toFixed(1)) 
    : 0;

  // 四半期ごとのデータ計算
  const quarters = Array.from(new Set(items.map(item => item.fiscalQuarter))).sort();
  
  quarters.forEach(quarter => {
    const quarterItems = items.filter(item => item.fiscalQuarter === quarter);
    const quarterTarget = quarterItems.reduce((sum, item) => sum + item.targetAmount, 0);
    const quarterActual = quarterItems.reduce((sum, item) => sum + item.actualAmount, 0);
    const quarterRate = quarterTarget > 0 
      ? parseFloat(((quarterActual / quarterTarget) * 100).toFixed(1)) 
      : 0;
    
    summary.quarterlyData.push({
      quarter,
      target: quarterTarget,
      actual: quarterActual,
      rate: quarterRate
    });
  });

  return summary;
};

const BudgetManagement: React.FC = () => {
  const navigate = useNavigate();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(mockBudgetItems);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>(generateBudgetSummary(mockBudgetItems));
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [filterYear, setFilterYear] = useState<number>(2023);
  const [filterQuarter, setFilterQuarter] = useState<number>(0); // 0は全期間
  
  // 新しい予算項目のための状態
  const [newBudgetItem, setNewBudgetItem] = useState<Partial<BudgetItem>>({
    name: '',
    targetAmount: 0,
    actualAmount: 0,
    ratio: 0,
    category: '売上',
    fiscalYear: 2023,
    fiscalQuarter: 1
  });

  // 予算概要の再計算
  useEffect(() => {
    setBudgetSummary(generateBudgetSummary(budgetItems));
  }, [budgetItems]);

  // フィルタリングされた予算項目の取得
  const getFilteredBudgetItems = () => {
    return budgetItems.filter(item => {
      const yearMatch = item.fiscalYear === filterYear;
      const quarterMatch = filterQuarter === 0 || item.fiscalQuarter === filterQuarter;
      return yearMatch && quarterMatch;
    });
  };

  // 年度フィルター変更ハンドラ
  const handleYearChange = (e: SelectChangeEvent<number>) => {
    setFilterYear(e.target.value as number);
  };

  // 四半期フィルター変更ハンドラ
  const handleQuarterChange = (e: SelectChangeEvent<number>) => {
    setFilterQuarter(e.target.value as number);
  };

  // 新規予算項目ダイアログを開く
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // 新規予算項目ダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // カテゴリー変更ハンドラ
  const handleCategoryChange = (e: SelectChangeEvent) => {
    setNewBudgetItem({
      ...newBudgetItem,
      category: e.target.value as '売上' | '原価' | 'その他'
    });
  };

  // 四半期変更ハンドラ
  const handleFiscalQuarterChange = (e: SelectChangeEvent<number>) => {
    setNewBudgetItem({
      ...newBudgetItem,
      fiscalQuarter: e.target.value as number
    });
  };

  // 予算比率の自動計算
  useEffect(() => {
    if (newBudgetItem.targetAmount !== undefined && newBudgetItem.actualAmount !== undefined) {
      const ratio = newBudgetItem.targetAmount > 0 
        ? parseFloat(((newBudgetItem.actualAmount / newBudgetItem.targetAmount) * 100).toFixed(1)) 
        : 0;
      
      setNewBudgetItem(prev => ({
        ...prev,
        ratio
      }));
    }
  }, [newBudgetItem.targetAmount, newBudgetItem.actualAmount]);

  // 予算項目保存処理
  const handleSaveBudgetItem = () => {
    if (!newBudgetItem.name) {
      setSnackbarMessage('項目名は必須です');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const newId = Math.max(...budgetItems.map(item => item.id), 0) + 1;
    const itemToAdd = {
      ...newBudgetItem,
      id: newId,
    } as BudgetItem;

    setBudgetItems([...budgetItems, itemToAdd]);
    setSnackbarMessage('予算項目を登録しました');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleCloseDialog();

    // フォームをリセット
    setNewBudgetItem({
      name: '',
      targetAmount: 0,
      actualAmount: 0,
      ratio: 0,
      category: '売上',
      fiscalYear: 2023,
      fiscalQuarter: 1
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={() => navigate('/consulting')} 
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <SectionHeader
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 32 }} />}
          title="予算管理"
          subtitle="予算比率設定、予算計算、期間別集計"
        />
      </Box>

      {/* 予算サマリーセクション */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  年間目標金額
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ¥{budgetSummary.totalTargetAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  実績金額
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ¥{budgetSummary.totalActualAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  達成率
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ mb: 1 }}
                  color={
                    budgetSummary.achievementRate >= 100 ? 'success.main' :
                    budgetSummary.achievementRate >= 90 ? 'warning.main' : 'error.main'
                  }
                >
                  {budgetSummary.achievementRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* 四半期別予算実績セクション */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          四半期別予算実績
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>四半期</TableCell>
                <TableCell align="right">目標金額</TableCell>
                <TableCell align="right">実績金額</TableCell>
                <TableCell align="right">達成率</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetSummary.quarterlyData.map((quarter) => (
                <TableRow key={quarter.quarter}>
                  <TableCell>{`第${quarter.quarter}四半期`}</TableCell>
                  <TableCell align="right">¥{quarter.target.toLocaleString()}</TableCell>
                  <TableCell align="right">¥{quarter.actual.toLocaleString()}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{
                      color: 
                        quarter.rate >= 100 ? 'success.main' :
                        quarter.rate >= 90 ? 'warning.main' : 'error.main'
                    }}
                  >
                    {quarter.rate}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 予算項目一覧セクション */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">予算項目一覧</Typography>
            <FormControl sx={{ minWidth: 120, ml: 2 }}>
              <InputLabel>年度</InputLabel>
              <Select
                value={filterYear}
                onChange={handleYearChange}
                label="年度"
              >
                <MenuItem value={2022}>2022年</MenuItem>
                <MenuItem value={2023}>2023年</MenuItem>
                <MenuItem value={2024}>2024年</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>四半期</InputLabel>
              <Select
                value={filterQuarter}
                onChange={handleQuarterChange}
                label="四半期"
              >
                <MenuItem value={0}>全期間</MenuItem>
                <MenuItem value={1}>第1四半期</MenuItem>
                <MenuItem value={2}>第2四半期</MenuItem>
                <MenuItem value={3}>第3四半期</MenuItem>
                <MenuItem value={4}>第4四半期</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            新規予算項目登録
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>項目名</TableCell>
                <TableCell>カテゴリ</TableCell>
                <TableCell>四半期</TableCell>
                <TableCell align="right">目標金額</TableCell>
                <TableCell align="right">実績金額</TableCell>
                <TableCell align="right">達成率</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredBudgetItems().map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{`第${item.fiscalQuarter}四半期`}</TableCell>
                  <TableCell align="right">¥{item.targetAmount.toLocaleString()}</TableCell>
                  <TableCell align="right">¥{item.actualAmount.toLocaleString()}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{
                      color: 
                        item.ratio >= 100 ? 'success.main' :
                        item.ratio >= 90 ? 'warning.main' : 'error.main'
                    }}
                  >
                    {item.ratio}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 新規予算項目登録ダイアログ */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>新規予算項目登録</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="項目名"
                fullWidth
                required
                value={newBudgetItem.name || ''}
                onChange={(e) => setNewBudgetItem({...newBudgetItem, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>カテゴリ</InputLabel>
                <Select
                  value={newBudgetItem.category || '売上'}
                  onChange={handleCategoryChange}
                  label="カテゴリ"
                >
                  <MenuItem value="売上">売上</MenuItem>
                  <MenuItem value="原価">原価</MenuItem>
                  <MenuItem value="その他">その他</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>四半期</InputLabel>
                <Select
                  value={newBudgetItem.fiscalQuarter || 1}
                  onChange={handleFiscalQuarterChange}
                  label="四半期"
                >
                  <MenuItem value={1}>第1四半期</MenuItem>
                  <MenuItem value={2}>第2四半期</MenuItem>
                  <MenuItem value={3}>第3四半期</MenuItem>
                  <MenuItem value={4}>第4四半期</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="年度"
                type="number"
                fullWidth
                value={newBudgetItem.fiscalYear || 2023}
                onChange={(e) => setNewBudgetItem({...newBudgetItem, fiscalYear: parseInt(e.target.value)})}
                inputProps={{ min: 2020, max: 2030 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="目標金額（円）"
                type="number"
                fullWidth
                value={newBudgetItem.targetAmount || 0}
                onChange={(e) => setNewBudgetItem({...newBudgetItem, targetAmount: parseInt(e.target.value)})}
                inputProps={{ min: 0, step: 10000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="実績金額（円）"
                type="number"
                fullWidth
                value={newBudgetItem.actualAmount || 0}
                onChange={(e) => setNewBudgetItem({...newBudgetItem, actualAmount: parseInt(e.target.value)})}
                inputProps={{ min: 0, step: 10000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="達成率（%）"
                type="number"
                fullWidth
                value={newBudgetItem.ratio || 0}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveBudgetItem} startIcon={<SaveIcon />}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* スナックバー通知 */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BudgetManagement; 