import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip,
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
  FormControlLabel,
  Switch,
  TextareaAutosize,
  Card,
  CardContent,
  CardActions,
  Divider,
  ButtonGroup,
  Tabs,
  Tab,
  Tooltip,
  DialogContentText,
  Avatar
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SectionHeader from '../../components/SectionHeader';
import { useNavigate } from 'react-router-dom';

// 顧客データの型定義
interface Customer {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}

// 発注先データの型定義
interface Vendor {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

// 請求タイミングの型定義
type BillingTiming = '月末締め' | '納品時' | '半期末' | 'マイルストーン' | 'その他';

// 案件データの型定義
interface Project {
  id: number;
  name: string;
  type: 'ファーム' | 'プライム';
  customerId: number;
  customerName: string;
  status: '入力中' | '確認済' | '請求処理済' | '完了';
  workload: number; // 工数
  workloadUnit: '人日' | '人月'; // 工数単位を人日/人月に変更
  unitPrice: number; // 単価
  cost: number; // 原価
  revenue: number; // 売上
  grossProfit: number; // 粗利
  grossProfitRate: number; // 粗利率
  startDate: string; // 開始日
  endDate: string; // 終了日
  
  // ファーム案件専用フィールド
  yearMonth?: string; // 年月（ファーム案件用）YYYY-MM形式
  
  // 共通フィールド
  vendorId?: number; // 発注先ID
  vendorName?: string; // 発注先名
  
  // プライム案件専用フィールド
  projectDescription?: string; // 委託内容
  billingTiming?: BillingTiming; // 請求タイミング

  // 追加フィールド
  participantName?: string; // 参画者名
  notes?: string; // 備考
}

// ダミー顧客データ
const mockCustomers: Customer[] = [
  { id: 1, name: '株式会社ABC', contactPerson: '山田太郎', email: 'yamada@abc.co.jp', phone: '03-1234-5678' },
  { id: 2, name: 'DEF商事', contactPerson: '佐藤次郎', email: 'sato@def.co.jp', phone: '03-8765-4321' },
  { id: 3, name: 'GHI工業', contactPerson: '鈴木花子', email: 'suzuki@ghi.co.jp', phone: '03-2345-6789' },
];

// ダミー発注先データ
const mockVendors: Vendor[] = [
  { id: 1, name: 'テクノロジーパートナーズ株式会社', contactPerson: '高橋一郎', email: 'takahashi@tech-partners.co.jp', phone: '03-1111-2222' },
  { id: 2, name: 'クラウドサービス株式会社', contactPerson: '田中誠', email: 'tanaka@cloud-service.co.jp', phone: '03-3333-4444' },
  { id: 3, name: 'デザインスタジオ', contactPerson: '伊藤美紀', email: 'ito@design-studio.jp', phone: '03-5555-6666' },
];

// ダミー案件データ
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'ABCシステム構築',
    type: 'ファーム',
    customerId: 1,
    customerName: '株式会社ABC',
    status: '入力中',
    workload: 1.5, // 1.5人月に変更
    workloadUnit: '人月', // 人月に変更
    unitPrice: 100000,
    cost: 2000000,
    revenue: 3000000,
    grossProfit: 1000000,
    grossProfitRate: 33.3,
    startDate: '2023-04-01',
    endDate: '2023-06-30',
    yearMonth: '2023-04',
    vendorId: 1,
    vendorName: 'テクノロジーパートナーズ株式会社',
    participantName: '山田太郎',
    notes: 'クライアントからフィードバック待ち'
  },
  {
    id: 2,
    name: 'DEF業務改善',
    type: 'プライム',
    customerId: 2,
    customerName: 'DEF商事',
    status: '確認済',
    workload: 2, // 2人月に変更
    workloadUnit: '人月', // 人月に変更
    unitPrice: 120000,
    cost: 1800000,
    revenue: 3500000,
    grossProfit: 1700000,
    grossProfitRate: 48.6,
    startDate: '2023-05-01',
    endDate: '2023-07-31',
    vendorId: 2,
    vendorName: 'クラウドサービス株式会社',
    projectDescription: 'DEF商事の業務プロセス改善およびシステム導入支援。\n- 現状分析・課題抽出\n- 改善施策の検討・提案\n- システム選定支援\n- 導入計画策定',
    billingTiming: '月末締め',
    participantName: '佐藤次郎',
    notes: '次回MTG: 5/15予定'
  },
];

// 単価マスタ（役職ごとの単価）
const unitPricesMaster = {
  junior: 80000,
  middle: 100000,
  senior: 150000,
  manager: 200000,
  director: 300000
};

// 請求タイミングの選択肢
const billingTimingOptions: BillingTiming[] = ['月末締め', '納品時', '半期末', 'マイルストーン', 'その他'];

const SalesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openVendorDialog, setOpenVendorDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // 新しい案件のための状態
  const [newProject, setNewProject] = useState<Partial<Project>>({
    type: 'ファーム',
    status: '入力中',
    workload: 0,
    workloadUnit: '人月', // デフォルトを人月に変更
    unitPrice: unitPricesMaster.middle,
    cost: 0,
    revenue: 0,
    grossProfit: 0,
    grossProfitRate: 0,
    yearMonth: new Date().toISOString().substring(0, 7), // 現在の年月をデフォルト値に
    participantName: '',
    notes: ''
  });

  // 新しい顧客のための状態
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  // 新しい発注先のための状態
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  // 期間タイプの状態（月次/四半期）
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'half_year'>('monthly');
  // 集計対象年の状態
  const [summaryYear, setSummaryYear] = useState<number>(new Date().getFullYear());
  // 表示タイプの状態（全体/ファーム/プライム）
  const [viewType, setViewType] = useState<'all' | 'farm' | 'prime'>('all');
  // 案件一覧の期間フィルター（通年/上期/下期）
  const [projectPeriodFilter, setProjectPeriodFilter] = useState<'all' | 'first_half' | 'second_half'>('all');
  // 案件種別フィルター（ファーム/プライム）
  const [projectTypeFilter, setProjectTypeFilter] = useState<'farm' | 'prime'>('farm');
  // 月別フィルター（ファーム案件用）
  const [monthFilter, setMonthFilter] = useState<number | null>(null);

  // 削除確認ダイアログの状態
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // 案件種別変更時の処理
  const handleProjectTypeChange = (e: SelectChangeEvent) => {
    const type = e.target.value as 'ファーム' | 'プライム';
    setNewProject({
      ...newProject,
      type,
      // プライムの場合は単価を変更しない
      unitPrice: type === 'ファーム' ? unitPricesMaster.middle : newProject.unitPrice
    });
  };

  // 顧客選択時の処理
  const handleCustomerChange = (e: SelectChangeEvent) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setNewProject({
        ...newProject,
        customerId: customerId,
        customerName: customer.name
      });
    }
  };

  // 発注先選択時の処理
  const handleVendorChange = (e: SelectChangeEvent) => {
    const vendorId = parseInt(e.target.value);
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setNewProject({
        ...newProject,
        vendorId: vendorId,
        vendorName: vendor.name
      });
    }
  };

  // 工数単位変更ハンドラ
  const handleWorkloadUnitChange = (e: SelectChangeEvent) => {
    setNewProject({
      ...newProject,
      workloadUnit: e.target.value as '人日' | '人月'
    });
  };

  // 請求タイミング変更ハンドラ
  const handleBillingTimingChange = (e: SelectChangeEvent) => {
    setNewProject({
      ...newProject,
      billingTiming: e.target.value as BillingTiming
    });
  };

  // 工数・単価変更時に原価を自動計算
  useEffect(() => {
    if (newProject.workload !== undefined && newProject.unitPrice !== undefined) {
      const cost = newProject.workload * newProject.unitPrice;
      setNewProject(prev => ({
        ...prev,
        cost
      }));
    }
  }, [newProject.workload, newProject.unitPrice]);

  // 原価・売上変更時に粗利を自動計算
  useEffect(() => {
    if (newProject.cost !== undefined && newProject.revenue !== undefined) {
      const grossProfit = newProject.revenue - newProject.cost;
      const grossProfitRate = newProject.revenue > 0 
        ? parseFloat((grossProfit / newProject.revenue * 100).toFixed(1)) 
        : 0;
      
      setNewProject(prev => ({
        ...prev,
        grossProfit,
        grossProfitRate
      }));
    }
  }, [newProject.cost, newProject.revenue]);

  // 新規案件ダイアログを開く
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // 新規案件ダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 新規顧客ダイアログを開く
  const handleOpenCustomerDialog = () => {
    setOpenCustomerDialog(true);
  };

  // 新規顧客ダイアログを閉じる
  const handleCloseCustomerDialog = () => {
    setOpenCustomerDialog(false);
  };

  // 新規発注先ダイアログを開く
  const handleOpenVendorDialog = () => {
    setOpenVendorDialog(true);
  };

  // 新規発注先ダイアログを閉じる
  const handleCloseVendorDialog = () => {
    setOpenVendorDialog(false);
  };

  // 案件保存処理
  const handleSaveProject = () => {
    if (!newProject.name || !newProject.customerId) {
      setSnackbarMessage('案件名と顧客は必須項目です');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // ファーム案件の場合、年月が必須
    if (newProject.type === 'ファーム' && !newProject.yearMonth) {
      setSnackbarMessage('ファーム案件では年月は必須項目です');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const projectToAdd = {
      ...newProject,
      id: newId,
    } as Project;

    setProjects([...projects, projectToAdd]);
    setSnackbarMessage('案件を登録しました');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleCloseDialog();

    // フォームをリセット
    setNewProject({
      type: 'ファーム',
      status: '入力中',
      workload: 0,
      workloadUnit: '人月',
      unitPrice: unitPricesMaster.middle,
      cost: 0,
      revenue: 0,
      grossProfit: 0,
      grossProfitRate: 0,
      yearMonth: new Date().toISOString().substring(0, 7),
      participantName: '',
      notes: ''
    });
  };

  // 顧客保存処理
  const handleSaveCustomer = () => {
    if (!newCustomer.name) {
      setSnackbarMessage('顧客名は必須項目です');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const newId = Math.max(...customers.map(c => c.id), 0) + 1;
    const customerToAdd = {
      ...newCustomer,
      id: newId,
    } as Customer;

    setCustomers([...customers, customerToAdd]);
    setSnackbarMessage('顧客を登録しました');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleCloseCustomerDialog();

    // フォームをリセット
    setNewCustomer({
      name: '',
      contactPerson: '',
      email: '',
      phone: ''
    });
  };

  // 発注先保存処理
  const handleSaveVendor = () => {
    if (!newVendor.name) {
      setSnackbarMessage('発注先名は必須項目です');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const newId = Math.max(...vendors.map(v => v.id), 0) + 1;
    const vendorToAdd = {
      ...newVendor,
      id: newId,
    } as Vendor;

    setVendors([...vendors, vendorToAdd]);
    setSnackbarMessage('発注先を登録しました');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleCloseVendorDialog();

    // フォームをリセット
    setNewVendor({
      name: '',
      contactPerson: '',
      email: '',
      phone: ''
    });
  };

  // 案件の種別によって表示するフィールドを決定
  const renderProjectTypeSpecificFields = () => {
    if (newProject.type === 'ファーム') {
      return (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              label="年月"
              type="month"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newProject.yearMonth || ''}
              onChange={(e) => setNewProject({...newProject, yearMonth: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>工数単位</InputLabel>
              <Select
                value={newProject.workloadUnit || '人月'}
                onChange={handleWorkloadUnitChange}
                label="工数単位"
              >
                <MenuItem value="人日">人日</MenuItem>
                <MenuItem value="人月">人月</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>請求タイミング</InputLabel>
              <Select
                value={newProject.billingTiming || '月末締め'}
                onChange={handleBillingTimingChange}
                label="請求タイミング"
              >
                {billingTimingOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="委託内容"
              fullWidth
              multiline
              rows={4}
              value={newProject.projectDescription || ''}
              onChange={(e) => setNewProject({...newProject, projectDescription: e.target.value})}
              placeholder="プロジェクトの委託内容や業務範囲を入力してください"
            />
          </Grid>
        </>
      );
    }
  };

  // 期間タイプ変更ハンドラ
  const handlePeriodTypeChange = (e: SelectChangeEvent) => {
    setPeriodType(e.target.value as 'monthly' | 'quarterly' | 'half_year');
  };

  // 集計年変更ハンドラ
  const handleSummaryYearChange = (e: SelectChangeEvent<number>) => {
    setSummaryYear(e.target.value as number);
  };

  // 表示タイプ変更ハンドラ
  const handleViewTypeChange = (e: SelectChangeEvent) => {
    setViewType(e.target.value as 'all' | 'farm' | 'prime');
  };

  // 案件一覧の期間フィルター変更ハンドラ
  const handleProjectPeriodFilterChange = (filter: 'all' | 'first_half' | 'second_half') => {
    setProjectPeriodFilter(filter);
  };

  // 案件種別フィルター変更ハンドラ
  const handleProjectTypeFilterChange = (filter: 'farm' | 'prime') => {
    setProjectTypeFilter(filter);
    // 案件種別が変わった場合は月別フィルターをリセット
    if (filter === 'prime') {
      setMonthFilter(null);
    }
  };

  // 月別フィルター変更ハンドラ
  const handleMonthFilterChange = (month: number) => {
    // 現在選択されている月と同じ月をクリックした場合はフィルターを解除
    if (monthFilter === month) {
      setMonthFilter(null);
    } else {
      setMonthFilter(month);
    }
  };

  // 期間フィルターと種別フィルター、月別フィルターに基づいて案件をフィルタリングする関数
  const getFilteredProjects = () => {
    return projects.filter(project => {
      // 種別フィルター
      if (projectTypeFilter === 'farm' && project.type !== 'ファーム') return false;
      if (projectTypeFilter === 'prime' && project.type !== 'プライム') return false;
      
      // ファーム案件で月別フィルターが指定されている場合
      if (project.type === 'ファーム' && monthFilter !== null && project.yearMonth) {
        const [_, monthStr] = project.yearMonth.split('-');
        const projectMonth = parseInt(monthStr);
        return projectMonth === monthFilter;
      }
      
      // 期間フィルターが「通年」の場合はさらなるフィルタリングなし
      if (projectPeriodFilter === 'all') return true;
      
      const currentYear = new Date().getFullYear();
      const firstHalfStart = new Date(currentYear, 0, 1); // 1月1日
      const firstHalfEnd = new Date(currentYear, 5, 30); // 6月30日
      const secondHalfStart = new Date(currentYear, 6, 1); // 7月1日
      const secondHalfEnd = new Date(currentYear, 11, 31); // 12月31日

      // ファーム案件の場合、yearMonthで判断
      if (project.type === 'ファーム' && project.yearMonth) {
        const [yearStr, monthStr] = project.yearMonth.split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr) - 1; // JavaScriptの月は0始まり
        
        if (year !== currentYear) return false;
        
        if (projectPeriodFilter === 'first_half') {
          return month >= 0 && month <= 5; // 1月から6月
        } else { // second_half
          return month >= 6 && month <= 11; // 7月から12月
        }
      } 
      // プライム案件の場合、開始日と終了日で判断
      else if (project.type === 'プライム' && project.startDate && project.endDate) {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        if (projectPeriodFilter === 'first_half') {
          // 上期との重なりをチェック
          return startDate <= firstHalfEnd && endDate >= firstHalfStart;
        } else { // second_half
          // 下期との重なりをチェック
          return startDate <= secondHalfEnd && endDate >= secondHalfStart;
        }
      }
      
      return false;
    });
  };

  // 日本語の月名を返す関数
  const getJapaneseMonthName = (month: number): string => {
    return `${month}月`;
  };

  // 月次データ型の定義
  interface MonthlyData {
    month: number;
    revenue: number;
    cost: number;
    profit: number;
    profitRate: number;
    projectsCount: number;
  }

  // 四半期データ型の定義
  interface QuarterlyData {
    quarter: number;
    revenue: number;
    cost: number;
    profit: number;
    profitRate: number;
    projectsCount: number;
  }

  // 期間データの型判定関数
  const isMonthlyData = (data: MonthlyData | QuarterlyData): data is MonthlyData => {
    return 'month' in data;
  };

  const isQuarterlyData = (data: MonthlyData | QuarterlyData): data is QuarterlyData => {
    return 'quarter' in data;
  };

  // 指定した年の月次データを取得
  const getMonthlyData = (): MonthlyData[] => {
    // 案件種別でフィルタリング
    const filteredProjects = projects.filter(project => {
      if (viewType === 'all') return true;
      if (viewType === 'farm') return project.type === 'ファーム';
      if (viewType === 'prime') return project.type === 'プライム';
      return true;
    });

    // 12ヶ月分の集計データを初期化
    const monthlyData: MonthlyData[] = Array(12).fill(0).map((_, index) => {
      return {
        month: index + 1,
        revenue: 0,
        cost: 0,
        profit: 0,
        profitRate: 0,
        projectsCount: 0
      };
    });

    // 各案件のデータを月次集計に加算
    filteredProjects.forEach(project => {
      // ファーム案件は年月からデータ集計
      if (project.type === 'ファーム' && project.yearMonth) {
        const [yearStr, monthStr] = project.yearMonth.split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);
        
        if (year === summaryYear) {
          monthlyData[month - 1].revenue += project.revenue;
          monthlyData[month - 1].cost += project.cost;
          monthlyData[month - 1].projectsCount += 1;
        }
      } 
      // プライム案件は期間内の月にデータを分配
      else if (project.type === 'プライム' && project.startDate && project.endDate) {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        // 該当年内の期間だけを対象にする
        const yearStart = new Date(summaryYear, 0, 1);
        const yearEnd = new Date(summaryYear, 11, 31);
        
        // 期間の交差をチェック
        if (startDate <= yearEnd && endDate >= yearStart) {
          // 期間内の月数を計算
          const start = new Date(Math.max(startDate.getTime(), yearStart.getTime()));
          const end = new Date(Math.min(endDate.getTime(), yearEnd.getTime()));
          
          // 月数計算（端数は切り上げ）
          const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
          
          if (months > 0) {
            // 各月に均等配分
            const revenuePerMonth = project.revenue / months;
            const costPerMonth = project.cost / months;
            
            // 期間内の各月に配分
            for (let month = start.getMonth(); month <= (start.getFullYear() === end.getFullYear() ? end.getMonth() : 11); month++) {
              monthlyData[month].revenue += revenuePerMonth;
              monthlyData[month].cost += costPerMonth;
              monthlyData[month].projectsCount += 1 / months; // 案件カウントも期間で割る
            }
            
            // 翌年がある場合
            if (start.getFullYear() < end.getFullYear()) {
              for (let month = 0; month <= end.getMonth(); month++) {
                monthlyData[month].revenue += revenuePerMonth;
                monthlyData[month].cost += costPerMonth;
                monthlyData[month].projectsCount += 1 / months;
              }
            }
          }
        }
      }
    });

    // 粗利と粗利率を計算
    monthlyData.forEach(data => {
      data.profit = data.revenue - data.cost;
      data.profitRate = data.revenue > 0 ? parseFloat((data.profit / data.revenue * 100).toFixed(1)) : 0;
      // 案件数は整数表示のために四捨五入
      data.projectsCount = Math.round(data.projectsCount);
    });

    return monthlyData;
  };

  // 四半期データを取得
  const getQuarterlyData = (): QuarterlyData[] => {
    const monthlyData = getMonthlyData();
    
    // 四半期データを初期化
    const quarterlyData: QuarterlyData[] = Array(4).fill(0).map((_, index) => {
      return {
        quarter: index + 1,
        revenue: 0,
        cost: 0,
        profit: 0,
        profitRate: 0,
        projectsCount: 0
      };
    });
    
    // 月次データを四半期にまとめる
    monthlyData.forEach((data, index) => {
      const quarterIndex = Math.floor(index / 3);
      quarterlyData[quarterIndex].revenue += data.revenue;
      quarterlyData[quarterIndex].cost += data.cost;
      quarterlyData[quarterIndex].projectsCount += data.projectsCount;
    });
    
    // 粗利と粗利率を計算
    quarterlyData.forEach(data => {
      data.profit = data.revenue - data.cost;
      data.profitRate = data.revenue > 0 ? parseFloat((data.profit / data.revenue * 100).toFixed(1)) : 0;
    });
    
    return quarterlyData;
  };

  // 合計データを計算
  const calculateTotalData = (dataArray: (MonthlyData | QuarterlyData | HalfYearData)[]) => {
    return dataArray.reduce((total, current) => {
      total.revenue += current.revenue;
      total.cost += current.cost;
      total.profit += current.profit;
      total.projectsCount += current.projectsCount;
      return total;
    }, {
      revenue: 0,
      cost: 0,
      profit: 0,
      profitRate: 0,
      projectsCount: 0
    });
  };

  // 表示中の案件の合計値を計算する関数
  const calculateDisplayedTotal = () => {
    const displayedProjects = getFilteredProjects();
    
    const total = displayedProjects.reduce((acc, project) => {
      acc.revenue += project.revenue;
      acc.cost += project.cost;
      acc.profit += project.grossProfit;
      return acc;
    }, {
      revenue: 0,
      cost: 0,
      profit: 0,
      profitRate: 0
    });
    
    // 粗利率を計算
    total.profitRate = total.revenue > 0 
      ? parseFloat((total.profit / total.revenue * 100).toFixed(1)) 
      : 0;
    
    return total;
  };

  // 削除確認ダイアログを開く
  const handleOpenDeleteDialog = (projectId: number) => {
    setProjectToDelete(projectId);
    setOpenDeleteDialog(true);
  };
  
  // 削除確認ダイアログを閉じる
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProjectToDelete(null);
  };
  
  // 案件削除処理
  const handleDeleteProject = () => {
    if (projectToDelete === null) return;
    
    const updatedProjects = projects.filter(project => project.id !== projectToDelete);
    setProjects(updatedProjects);
    
    setSnackbarMessage('案件を削除しました');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    handleCloseDeleteDialog();
  };

  // 半期データを計算する関数
  interface HalfYearData {
    period: '上期' | '下期';
    revenue: number;
    cost: number;
    profit: number;
    profitRate: number;
    projectsCount: number;
  }

  const getHalfYearData = (): HalfYearData[] => {
    const filteredProjects = projects.filter(project => {
      // プロジェクト開始年または終了年が選択年と一致するプロジェクトをフィルタリング
      const startYear = new Date(project.startDate).getFullYear();
      const endYear = new Date(project.endDate).getFullYear();
      
      // 表示対象のプロジェクトタイプをフィルタリング
      const typeFilter = viewType === 'all' || 
        (viewType === 'farm' && project.type === 'ファーム') || 
        (viewType === 'prime' && project.type === 'プライム');
      
      return typeFilter && (startYear === summaryYear || endYear === summaryYear);
    });

    // 上期（4月-9月）と下期（10月-3月）のデータを初期化
    const halfYearData: HalfYearData[] = [
      { period: '上期', revenue: 0, cost: 0, profit: 0, profitRate: 0, projectsCount: 0 },
      { period: '下期', revenue: 0, cost: 0, profit: 0, profitRate: 0, projectsCount: 0 }
    ];
    
    // プロジェクトから半期データを集計
    const projectsInFirstHalf = new Set<number>();
    const projectsInSecondHalf = new Set<number>();
    
    filteredProjects.forEach(project => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      
      // 月あたりの収益と原価を計算（簡易的な計算方法）
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
      const dailyRevenue = project.revenue / totalDays;
      const dailyCost = project.cost / totalDays;
      
      // 各月の日数分の収益と原価を集計
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // JavaScriptの月は0-11
        
        if (currentYear === summaryYear) {
          // 上期（4月-9月）
          if (currentMonth >= 4 && currentMonth <= 9) {
            halfYearData[0].revenue += dailyRevenue;
            halfYearData[0].cost += dailyCost;
            projectsInFirstHalf.add(project.id);
          }
          // 下期（10月-3月）
          else if ((currentMonth >= 10 && currentMonth <= 12) || (currentMonth >= 1 && currentMonth <= 3)) {
            halfYearData[1].revenue += dailyRevenue;
            halfYearData[1].cost += dailyCost;
            projectsInSecondHalf.add(project.id);
          }
        } else if (currentYear === summaryYear - 1 && currentMonth >= 10 && currentMonth <= 12) {
          // 前年度の10-12月（当年度の下期に含める）
          halfYearData[1].revenue += dailyRevenue;
          halfYearData[1].cost += dailyCost;
          projectsInSecondHalf.add(project.id);
        } else if (currentYear === summaryYear + 1 && currentMonth >= 1 && currentMonth <= 3) {
          // 翌年度の1-3月（当年度の下期に含める）
          halfYearData[1].revenue += dailyRevenue;
          halfYearData[1].cost += dailyCost;
          projectsInSecondHalf.add(project.id);
        }
        
        // 次の日に進める
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // 粗利と粗利率を計算
    halfYearData.forEach(data => {
      data.profit = data.revenue - data.cost;
      data.profitRate = data.revenue > 0 ? parseFloat((data.profit / data.revenue * 100).toFixed(1)) : 0;
    });
    
    // 案件数を設定
    halfYearData[0].projectsCount = projectsInFirstHalf.size;
    halfYearData[1].projectsCount = projectsInSecondHalf.size;
    
    return halfYearData;
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
          icon={<MonetizationOnIcon sx={{ fontSize: 32 }} />}
          title="売上/コスト管理"
          subtitle="案件登録、売上・コスト入力、粗利計算"
        />
      </Box>

      {/* 売上集計セクション */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">売上集計</Typography>
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>集計年</InputLabel>
              <Select
                value={summaryYear}
                onChange={(e) => handleSummaryYearChange(e as SelectChangeEvent<number>)}
                label="集計年"
              >
                <MenuItem value={2022}>2022年</MenuItem>
                <MenuItem value={2023}>2023年</MenuItem>
                <MenuItem value={2024}>2024年</MenuItem>
                <MenuItem value={2025}>2025年</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>期間単位</InputLabel>
              <Select
                value={periodType}
                onChange={(e) => handlePeriodTypeChange(e as SelectChangeEvent)}
                label="期間単位"
              >
                <MenuItem value="monthly">月次</MenuItem>
                <MenuItem value="quarterly">四半期</MenuItem>
                <MenuItem value="half_year">半期</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>案件種別</InputLabel>
              <Select
                value={viewType}
                onChange={(e) => handleViewTypeChange(e as SelectChangeEvent)}
                label="案件種別"
              >
                <MenuItem value="all">全体</MenuItem>
                <MenuItem value="farm">ファーム</MenuItem>
                <MenuItem value="prime">プライム</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* 指標サマリーカード */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  総売上
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ¥{periodType === 'monthly'
                    ? calculateTotalData(getMonthlyData()).revenue.toLocaleString()
                    : periodType === 'quarterly'
                      ? calculateTotalData(getQuarterlyData()).revenue.toLocaleString()
                      : calculateTotalData(getHalfYearData()).revenue.toLocaleString()
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  総原価
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ¥{periodType === 'monthly'
                    ? calculateTotalData(getMonthlyData()).cost.toLocaleString()
                    : periodType === 'quarterly'
                      ? calculateTotalData(getQuarterlyData()).cost.toLocaleString()
                      : calculateTotalData(getHalfYearData()).cost.toLocaleString()
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  総粗利
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ¥{periodType === 'monthly'
                    ? calculateTotalData(getMonthlyData()).profit.toLocaleString()
                    : periodType === 'quarterly'
                      ? calculateTotalData(getQuarterlyData()).profit.toLocaleString()
                      : calculateTotalData(getHalfYearData()).profit.toLocaleString()
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  平均粗利率
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {(() => {
                    const totalData = periodType === 'monthly'
                      ? calculateTotalData(getMonthlyData())
                      : periodType === 'quarterly'
                        ? calculateTotalData(getQuarterlyData())
                        : calculateTotalData(getHalfYearData());
                    return totalData.revenue > 0
                      ? (totalData.profit / totalData.revenue * 100).toFixed(1)
                      : '0.0';
                  })()}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 月次/四半期/半期データテーブル */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {periodType === 'monthly' 
                    ? '月' 
                    : periodType === 'quarterly' 
                      ? '四半期' 
                      : '期間'}
                </TableCell>
                <TableCell align="right">売上</TableCell>
                <TableCell align="right">原価</TableCell>
                <TableCell align="right">粗利</TableCell>
                <TableCell align="right">粗利率</TableCell>
                <TableCell align="right">案件数</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                if (periodType === 'monthly') {
                  const data = getMonthlyData();
                  return data.map((period) => (
                    <TableRow key={`month-${period.month}`}>
                      <TableCell>{`${period.month}月`}</TableCell>
                      <TableCell align="right">¥{period.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{period.cost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{period.profit.toLocaleString()}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          color: 
                            period.profitRate >= 40 ? 'success.main' :
                            period.profitRate >= 20 ? 'warning.main' : 
                            period.revenue > 0 ? 'error.main' : 'text.secondary'
                        }}
                      >
                        {period.profitRate}%
                      </TableCell>
                      <TableCell align="right">{period.projectsCount}</TableCell>
                    </TableRow>
                  ));
                } else if (periodType === 'quarterly') {
                  const data = getQuarterlyData();
                  return data.map((period) => (
                    <TableRow key={`quarter-${period.quarter}`}>
                      <TableCell>{`第${period.quarter}四半期`}</TableCell>
                      <TableCell align="right">¥{period.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{period.cost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{period.profit.toLocaleString()}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          color: 
                            period.profitRate >= 40 ? 'success.main' :
                            period.profitRate >= 20 ? 'warning.main' : 
                            period.revenue > 0 ? 'error.main' : 'text.secondary'
                        }}
                      >
                        {period.profitRate}%
                      </TableCell>
                      <TableCell align="right">{period.projectsCount}</TableCell>
                    </TableRow>
                  ));
                } else { // half_year
                  const data = getHalfYearData();
                  return data.map((period) => (
                    <TableRow key={`half-${period.period}`}>
                      <TableCell>{period.period}</TableCell>
                      <TableCell align="right">¥{period.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{period.cost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{period.profit.toLocaleString()}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          color: 
                            period.profitRate >= 40 ? 'success.main' :
                            period.profitRate >= 20 ? 'warning.main' : 
                            period.revenue > 0 ? 'error.main' : 'text.secondary'
                        }}
                      >
                        {period.profitRate}%
                      </TableCell>
                      <TableCell align="right">{period.projectsCount}</TableCell>
                    </TableRow>
                  ));
                }
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 案件一覧セクション */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">案件一覧</Typography>
          <Box display="flex" gap={2}>
            <ButtonGroup variant="outlined" size="small">
              <Button 
                color={projectPeriodFilter === 'all' ? 'primary' : 'inherit'}
                variant={projectPeriodFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleProjectPeriodFilterChange('all')}
              >
                通年
              </Button>
              <Button 
                color={projectPeriodFilter === 'first_half' ? 'primary' : 'inherit'}
                variant={projectPeriodFilter === 'first_half' ? 'contained' : 'outlined'}
                onClick={() => handleProjectPeriodFilterChange('first_half')}
              >
                上期
              </Button>
              <Button 
                color={projectPeriodFilter === 'second_half' ? 'primary' : 'inherit'}
                variant={projectPeriodFilter === 'second_half' ? 'contained' : 'outlined'}
                onClick={() => handleProjectPeriodFilterChange('second_half')}
              >
                下期
              </Button>
            </ButtonGroup>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              新規案件登録
            </Button>
          </Box>
        </Box>

        {/* 案件種別タブ */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={projectTypeFilter} 
            onChange={(_, newValue) => handleProjectTypeFilterChange(newValue)}
            aria-label="案件種別タブ"
          >
            <Tab label="ファーム案件" value="farm" />
            <Tab label="プライム案件" value="prime" />
          </Tabs>
        </Box>

        {/* ファーム案件表示 - テーブル形式 */}
        {projectTypeFilter === 'farm' && (
          <>
            {/* 月別フィルター - ファーム案件タブ選択時のみ表示 */}
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3].map((month) => (
                <Button 
                  key={month}
                  variant={monthFilter === month ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleMonthFilterChange(month)}
                  sx={{ minWidth: '60px' }}
                >
                  {getJapaneseMonthName(month)}
                </Button>
              ))}
            </Box>

            {/* 集計情報表示 */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: 'background.default', 
              borderRadius: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'center'
            }}>
              {(() => {
                const total = calculateDisplayedTotal();
                return (
                  <>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">売上</Typography>
                      <Typography variant="h6">¥{total.revenue.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">原価</Typography>
                      <Typography variant="h6">¥{total.cost.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">粗利</Typography>
                      <Typography variant="h6">¥{total.profit.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">粗利率</Typography>
                      <Typography variant="h6" color={
                        total.profitRate >= 40 ? 'success.main' :
                        total.profitRate >= 20 ? 'warning.main' : 
                        total.revenue > 0 ? 'error.main' : 'text.secondary'
                      }>
                        {total.profitRate}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">件数</Typography>
                      <Typography variant="h6">{getFilteredProjects().length}件</Typography>
                    </Box>
                  </>
                );
              })()}
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>顧客名</TableCell>
                    <TableCell>参画者名</TableCell>
                    <TableCell>稼働工数</TableCell>
                    <TableCell align="right">売上</TableCell>
                    <TableCell align="right">原価</TableCell>
                    <TableCell align="right">粗利</TableCell>
                    <TableCell align="right">粗利率</TableCell>
                    <TableCell>発注先</TableCell>
                    <TableCell>備考</TableCell>
                    <TableCell width="50px"></TableCell> {/* 操作アイコン用の列 */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredProjects().map((project) => (
                    <TableRow 
                      key={project.id}
                      sx={{ 
                        '&:hover .row-actions': { 
                          visibility: 'visible',
                          opacity: 1
                        } 
                      }}
                    >
                      <TableCell>{project.customerName}</TableCell>
                      <TableCell>{project.participantName || '-'}</TableCell>
                      <TableCell>{`${project.workload}${project.workloadUnit}`}</TableCell>
                      <TableCell align="right">¥{project.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{project.cost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{project.grossProfit.toLocaleString()}</TableCell>
                      <TableCell align="right">{project.grossProfitRate}%</TableCell>
                      <TableCell>{project.vendorName || '-'}</TableCell>
                      <TableCell>{project.notes || '-'}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="削除">
                          <IconButton
                            size="small"
                            color="error"
                            className="row-actions"
                            onClick={() => handleOpenDeleteDialog(project.id)}
                            sx={{ 
                              visibility: 'hidden', 
                              opacity: 0,
                              transition: 'visibility 0s, opacity 0.2s linear'
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* 新規追加ボタン行 */}
                  <TableRow>
                    <TableCell colSpan={10} align="left" sx={{ py: 3 }}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{ minWidth: 200, ml: 2 }}
                      >
                        新規案件を追加
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* プライム案件表示 - カンバン形式 */}
        {projectTypeFilter === 'prime' && (
          <>
            <Grid container spacing={3}>
              {getFilteredProjects().map((project) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      position: 'relative',
                      '&:hover .card-actions': { 
                        visibility: 'visible',
                        opacity: 1
                      } 
                    }}
                  >
                    {/* 削除アクション - 右上に配置 */}
                    <Box 
                      className="card-actions"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        zIndex: 1,
                        visibility: 'hidden', 
                        opacity: 0,
                        transition: 'visibility 0s, opacity 0.2s linear'
                      }}
                    >
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(project.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <CardContent>
                      {/* 顧客名 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                          <BusinessIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" noWrap title={project.customerName}>
                          {project.customerName}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      {/* 財務情報 */}
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            <AccountBalanceIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            売上
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ¥{project.revenue.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            <MonetizationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            原価
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ¥{project.cost.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            <TrendingUpIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            粗利率
                          </Typography>
                          <Typography 
                            variant="body1" 
                            fontWeight="bold"
                            color={
                              project.grossProfitRate >= 40 ? 'success.main' :
                              project.grossProfitRate >= 20 ? 'warning.main' : 'error.main'
                            }
                          >
                            {project.grossProfitRate}%
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {/* プロジェクト期間 */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateRangeIcon fontSize="small" sx={{ mr: 1 }} color="action" />
                        <Typography variant="body2">
                          {project.startDate} 〜 {project.endDate}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {/* 新規追加ボタンをカード形式で末行に配置 */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    cursor: 'pointer'
                  }}
                  onClick={handleOpenDialog}
                >
                  <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1" color="primary">
                    新規案件を追加
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      {/* 新規案件登録ダイアログ */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          新規案件登録
          {newProject.type && (
            <Chip 
              label={newProject.type} 
              color={newProject.type === 'ファーム' ? 'primary' : 'secondary'}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="案件名"
                fullWidth
                required
                value={newProject.name || ''}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>案件種別</InputLabel>
                <Select
                  value={newProject.type || 'ファーム'}
                  onChange={handleProjectTypeChange}
                  label="案件種別"
                >
                  <MenuItem value="ファーム">ファーム</MenuItem>
                  <MenuItem value="プライム">プライム</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>顧客</InputLabel>
                <Select
                  value={newProject.customerId?.toString() || ''}
                  onChange={handleCustomerChange}
                  label="顧客"
                  required
                >
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleOpenCustomerDialog}
                fullWidth
                sx={{ height: '56px' }}
              >
                新規顧客登録
              </Button>
            </Grid>

            {renderProjectTypeSpecificFields()}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                工数・原価計算
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label={`工数（${newProject.workloadUnit || '人月'}）`}
                type="number"
                fullWidth
                value={newProject.workload || 0}
                onChange={(e) => setNewProject({...newProject, workload: parseFloat(e.target.value)})}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={`単価（円/${newProject.workloadUnit || '人月'}）`}
                type="number"
                fullWidth
                value={newProject.unitPrice || 0}
                onChange={(e) => setNewProject({...newProject, unitPrice: parseInt(e.target.value)})}
                inputProps={{ min: 0, step: 10000 }}
                disabled={newProject.type === 'ファーム'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="原価（円）"
                type="number"
                fullWidth
                value={newProject.cost || 0}
                onChange={(e) => setNewProject({...newProject, cost: parseInt(e.target.value)})}
                inputProps={{ min: 0 }}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="売上（円）"
                type="number"
                fullWidth
                value={newProject.revenue || 0}
                onChange={(e) => setNewProject({...newProject, revenue: parseInt(e.target.value)})}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="粗利（円）"
                type="number"
                fullWidth
                value={newProject.grossProfit || 0}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="粗利率（%）"
                type="number"
                fullWidth
                value={newProject.grossProfitRate || 0}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                発注先情報
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>発注先</InputLabel>
                <Select
                  value={newProject.vendorId?.toString() || ''}
                  onChange={handleVendorChange}
                  label="発注先"
                >
                  <MenuItem value="">未選択</MenuItem>
                  {vendors.map(vendor => (
                    <MenuItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleOpenVendorDialog}
                fullWidth
                sx={{ height: '56px' }}
              >
                新規発注先登録
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                その他の情報
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="開始日"
                type="date"
                fullWidth
                value={newProject.startDate || ''}
                onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="終了日"
                type="date"
                fullWidth
                value={newProject.endDate || ''}
                onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={newProject.status || '入力中'}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                  label="ステータス"
                >
                  <MenuItem value="入力中">入力中</MenuItem>
                  <MenuItem value="確認済">確認済</MenuItem>
                  <MenuItem value="請求処理済">請求処理済</MenuItem>
                  <MenuItem value="完了">完了</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="参画者名"
                fullWidth
                value={newProject.participantName || ''}
                onChange={(e) => setNewProject({...newProject, participantName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="備考"
                fullWidth
                multiline
                rows={2}
                value={newProject.notes || ''}
                onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
                placeholder="備考や特記事項があれば入力してください"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveProject}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* 新規顧客登録ダイアログ */}
      <Dialog 
        open={openCustomerDialog} 
        onClose={handleCloseCustomerDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>新規顧客登録</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="顧客名"
                fullWidth
                required
                value={newCustomer.name || ''}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="担当者名"
                fullWidth
                value={newCustomer.contactPerson || ''}
                onChange={(e) => setNewCustomer({...newCustomer, contactPerson: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="メールアドレス"
                fullWidth
                type="email"
                value={newCustomer.email || ''}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="電話番号"
                fullWidth
                value={newCustomer.phone || ''}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomerDialog}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveCustomer}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* 新規発注先登録ダイアログ */}
      <Dialog 
        open={openVendorDialog} 
        onClose={handleCloseVendorDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>新規発注先登録</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="発注先名"
                fullWidth
                required
                value={newVendor.name || ''}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="担当者名"
                fullWidth
                value={newVendor.contactPerson || ''}
                onChange={(e) => setNewVendor({...newVendor, contactPerson: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="メールアドレス"
                fullWidth
                type="email"
                value={newVendor.email || ''}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="電話番号"
                fullWidth
                value={newVendor.phone || ''}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVendorDialog}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveVendor}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>案件削除の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この案件を削除してもよろしいですか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>キャンセル</Button>
          <Button 
            onClick={handleDeleteProject} 
            color="error" 
            variant="contained"
          >
            削除する
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

export default SalesManagement; 