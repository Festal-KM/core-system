import { useState } from 'react';
import { Box, Tabs, Tab, Grid, Card, CardContent, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, CircularProgress, Alert } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SectionHeader from '../components/SectionHeader';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';
import dayjs from 'dayjs';

// モックデータ型
const TAX_RATE = 0.1;

const initialInvoices = [
  {
    id: 'INV-20240601-001',
    date: '2024-06-01',
    client: '株式会社サンプル',
    department: '経理部',
    amount: 100000,
    tax: 10000,
    total: 110000,
    due: '2024-06-30',
    issuer: '山田太郎',
    issuerDept: '経理部',
    issuerTel: '03-1234-5678',
    issuerMail: 'taro@example.com',
    bank: 'みずほ銀行 新宿支店 1234567',
    note: '6月分コンサル費用',
    fileUrl: '',
  },
];

// 事業部・領域の選択肢
const divisionOptions = ['コンサル', '営業', 'BPO', '地方創生'];
const areaOptions = ['IT', 'イベント', 'コールセンター', '戦略', '営業', 'コンサル', '地方創生', ''];

// サンプルデータ（ユーザー提供の表から一部抜粋）
const initialLedger = [
  { id: '202411292205', date: '2024-11-30', client: '株式会社キングポケット', division: 'コンサル', area: 'IT', total: 550000, issuer: '宮田', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411302204', date: '2024-11-30', client: '株式会社ライオン', division: 'コンサル', area: 'IT', total: 1670000, issuer: '宮﨑', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411301101', date: '2024-11-30', client: '株式会社ANSTEYPE', division: '営業', area: 'イベント', total: 3911170, issuer: '阿部', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411301102', date: '2024-11-30', client: '株式会社伊織', division: '営業', area: 'イベント', total: 231000, issuer: '阿部', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411301103', date: '2024-11-30', client: 'You&IPartners株式会社', division: '営業', area: 'イベント', total: 27500, issuer: '阿部', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411301104', date: '2024-11-30', client: '株式会社HighLife', division: '営業', area: 'イベント', total: 184800, issuer: '阿部', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411303104', date: '2024-11-30', client: '株式会社誉', division: 'BPO', area: 'コールセンター', total: 309760, issuer: '本間', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  { id: '202411303206', date: '2024-11-30', client: '株式会社RESTA', division: 'BPO', area: 'コールセンター', total: 75900, issuer: '本間', due: '2024-12-31', expected: '2024-12-31', status: '完了' },
  // ...（必要に応じて追加）
];

const statusOptions = ['未入金', '一部入金', '入金済', '調整済'];

const AccountingPage = () => {
  const [tab, setTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [ledger, setLedger] = useState(initialLedger);
  const [form, setForm] = useState({
    client: '', department: '', amount: '', due: '', issuer: '', issuerDept: '', issuerTel: '', issuerMail: '', bank: '', note: '', mailTo: '', mailTanto: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState({ client: '', status: '', dateFrom: '', dateTo: '', division: '', area: '' });

  // 担当者・会社名・事業部・領域の選択肢を台帳データから自動抽出
  const unique = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean);
  const ledgerPeople = unique(initialLedger.map(row => row.issuer));
  const ledgerClients = unique(initialLedger.map(row => row.client));
  const ledgerDivisions = unique(initialLedger.map(row => row.division));
  const ledgerAreas = unique(initialLedger.map(row => row.area));

  // 請求書発行フォーム送信
  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfUrl(null);
    try {
      const amount = Number(form.amount);
      const tax = Math.round(amount * TAX_RATE);
      const total = amount + tax;
      const newInvoice = {
        id: `INV-${Date.now()}`,
        date: new Date().toISOString().slice(0,10),
        client: form.client,
        department: form.department,
        amount,
        tax,
        total,
        due: form.due,
        issuer: form.issuer,
        issuerDept: form.issuerDept,
        issuerTel: form.issuerTel,
        issuerMail: form.issuerMail,
        bank: form.bank,
        note: form.note,
        mailTo: form.mailTo,
        mailTanto: form.mailTanto,
        fileUrl: '',
      };
      // --- API連携 ---
      const res = await fetch('http://localhost:8000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });
      if (!res.ok) throw new Error('APIリクエストに失敗しました');
      const data = await res.json();
      setInvoices([newInvoice, ...invoices]);
      setForm({ client: '', department: '', amount: '', due: '', issuer: '', issuerDept: '', issuerTel: '', issuerMail: '', bank: '', note: '', mailTo: '', mailTanto: '' });
      setSnackbarMsg(data.message || '請求書を発行・送信しました');
      setSnackbarOpen(true);
      setPdfUrl(null);

      // メール送信APIを呼び出し
      const subject = `${newInvoice.client}様 請求書のご送付`;
      const body = `お世話になっております。\n\n請求書をお送りします。\n\n請求書PDF: ${data.pdfUrl || ''}\n\n何卒よろしくお願いいたします。`;
      
      try {
        const emailRes = await fetch('http://localhost:8000/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: form.mailTo,
            subject,
            body,
            pdf_path: data.pdfUrl
          }),
        });
        
        if (!emailRes.ok) {
          throw new Error('メール送信に失敗しました');
        }
        
        const emailData = await emailRes.json();
        setSnackbarMsg('メール送信が完了しました');
        setSnackbarOpen(true);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'メール送信に失敗しました';
        setError(errorMessage);
        setSnackbarMsg('メール送信に失敗しました');
        setSnackbarOpen(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <SectionHeader
        icon={<AccountBalanceIcon sx={{ fontSize: 40 }} />}
        title="経理"
        subtitle="請求書発行・経理台帳記帳の管理画面です。"
      />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2, mb: 3 }}>
        <Tab label="請求書発行（新規）" />
        <Tab label="請求書発行（既存）" />
        <Tab label="請求書台帳" />
      </Tabs>
      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={500} gutterBottom>請求書発行フォーム</Typography>
                <Box component="form" onSubmit={handleInvoiceSubmit} sx={{ mt: 2 }}>
                  <TextField label="請求先企業名" fullWidth required sx={{ mb: 2 }} value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
                  <TextField label="請求先部署・担当者" fullWidth sx={{ mb: 2 }} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
                  <TextField label="請求金額（税抜）" type="number" fullWidth required sx={{ mb: 2 }} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  <TextField label="支払期日" type="date" fullWidth required sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
                  <TextField label="発行者氏名" fullWidth required sx={{ mb: 2 }} value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} />
                  <TextField label="発行者部署名" fullWidth sx={{ mb: 2 }} value={form.issuerDept} onChange={e => setForm(f => ({ ...f, issuerDept: e.target.value }))} />
                  <TextField label="発行者TEL" fullWidth sx={{ mb: 2 }} value={form.issuerTel} onChange={e => setForm(f => ({ ...f, issuerTel: e.target.value }))} />
                  <TextField label="発行者メールアドレス" fullWidth sx={{ mb: 2 }} value={form.issuerMail} onChange={e => setForm(f => ({ ...f, issuerMail: e.target.value }))} />
                  <TextField label="振込先口座" fullWidth sx={{ mb: 2 }} value={form.bank} onChange={e => setForm(f => ({ ...f, bank: e.target.value }))} />
                  <TextField label="備考" fullWidth multiline minRows={2} sx={{ mb: 2 }} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                  <TextField label="送信先メールアドレス" fullWidth required sx={{ mb: 2 }} value={form.mailTo} onChange={e => setForm(f => ({ ...f, mailTo: e.target.value }))} />
                  <TextField label="担当者名（メール文中）" fullWidth required sx={{ mb: 2 }} value={form.mailTanto} onChange={e => setForm(f => ({ ...f, mailTanto: e.target.value }))} />
                  <Button type="submit" variant="contained" color="primary">メールにて送付</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 400, background: '#fafbfc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <CardContent sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: '794px',
                    height: '1123px',
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    background: '#fff',
                    boxShadow: 3,
                    p: 0,
                    m: 'auto',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #ccc',
                  }}
                >
                  {/* 青帯タイトル */}
                  <Box sx={{ width: '100%', bgcolor: '#2356a0', color: 'white', py: 2, textAlign: 'center', fontWeight: 700, fontSize: 28, letterSpacing: 8 }}>
                    御 請 求 書
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', p: 4, pb: 2 }}>
                    {/* 左側：宛名・金額・支払期限 */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{form.client || 'XXXXXXXXXXXXXX'} 御中</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>下記の通り御請求申し上げます。</Typography>
                      <Box sx={{ border: '2px solid #2356a0', borderRadius: 2, p: 2, mb: 2, width: 220, textAlign: 'center' }}>
                        <Typography variant="body2">御請求額（税込）</Typography>
                        <Typography variant="h5" fontWeight={700}>￥{form.amount ? (Number(form.amount) + Math.round(Number(form.amount) * TAX_RATE)).toLocaleString() : '0'}</Typography>
                      </Box>
                      <Typography variant="body2">お支払期限：<b>{form.due || '2024/7/4'}</b></Typography>
                    </Box>
                    {/* 右側：発行日・番号・会社情報・印影 */}
                    <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>発行日：{new Date().toISOString().slice(0,10)}</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>請求書No：{`INV-${Date.now()}`}</Typography>
                      <Box sx={{ textAlign: 'left', ml: 'auto', width: 260 }}>
                        <Typography variant="body2" fontWeight={700}>株式会社Festal</Typography>
                        <Typography variant="body2">〒330-0802</Typography>
                        <Typography variant="body2">埼玉県さいたま市大宮区宮町3丁目1-7宮村HSビル2F</Typography>
                        <Typography variant="body2">E-mail：info@festal-inc.com</Typography>
                        <Typography variant="body2">登録番号：T1010401165324</Typography>
                        <Box sx={{ mt: 1, width: 80, height: 80, border: '1px solid #aaa', borderRadius: 2, display: 'inline-block', textAlign: 'center', lineHeight: '80px', fontSize: 18, color: '#aaa' }}>
                          印影
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {/* 明細表 */}
                  <Box sx={{ px: 4, mt: 2 }}>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                      <Box component="thead">
                        <Box component="tr" sx={{ bgcolor: '#2356a0', color: 'white' }}>
                          <Box component="th" sx={{ border: '1px solid #2356a0', p: 1, color: 'white', fontWeight: 700 }}>摘要</Box>
                          <Box component="th" sx={{ border: '1px solid #2356a0', p: 1, color: 'white', fontWeight: 700 }}>単価</Box>
                          <Box component="th" sx={{ border: '1px solid #2356a0', p: 1, color: 'white', fontWeight: 700 }}>数量</Box>
                          <Box component="th" sx={{ border: '1px solid #2356a0', p: 1, color: 'white', fontWeight: 700 }}>合計金額</Box>
                          <Box component="th" sx={{ border: '1px solid #2356a0', p: 1, color: 'white', fontWeight: 700 }}>備考</Box>
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {[...Array(10)].map((_, i) => (
                          <Box component="tr" key={i}>
                            <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, height: 32 }}></Box>
                            <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}></Box>
                            <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}></Box>
                            <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}></Box>
                            <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}></Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  {/* 消費税区分・合計欄 */}
                  <Box sx={{ px: 4, mt: 2 }}>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                      <Box component="tbody">
                        <Box component="tr">
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, bgcolor: '#2356a0', color: 'white', width: 120 }}>10%対象</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, width: 100 }}>￥0</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, width: 80 }}>消費税</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, width: 100 }}>￥0</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, width: 80 }}>小計</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, width: 100 }}>￥0</Box>
                        </Box>
                        <Box component="tr">
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, bgcolor: '#2356a0', color: 'white' }}>対象外</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}>￥0</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}>消費税</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}>-</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}>消費税</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}>￥0</Box>
                        </Box>
                        <Box component="tr">
                          <Box component="td" colSpan={4} sx={{ border: '1px solid #2356a0', p: 1, textAlign: 'right', fontWeight: 700 }}>合計</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1, fontWeight: 700 }}>￥0</Box>
                          <Box component="td" sx={{ border: '1px solid #2356a0', p: 1 }}></Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {/* 振込先 */}
                  <Box sx={{ px: 4, mt: 2, mb: 4 }}>
                    <Box sx={{ bgcolor: '#2356a0', color: 'white', p: 1, fontWeight: 700 }}>お振込先</Box>
                    <Box sx={{ border: '1px solid #2356a0', borderTop: 'none', p: 2 }}>
                      <Typography variant="body2">GMOあおぞらネット銀行 法人営業部</Typography>
                      <Typography variant="body2">口座番号 1337538</Typography>
                      <Typography variant="body2">口座名義　カ）フェスタル</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {tab === 1 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700}>請求書発行（既存）</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
              <TextField label="担当者" select size="small" sx={{ minWidth: 160 }}>
                {ledgerPeople.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
              <TextField label="会社名" select size="small" sx={{ minWidth: 200 }}>
                {ledgerClients.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
              <TextField label="事業部" select size="small" sx={{ minWidth: 120 }}>
                {ledgerDivisions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
              <TextField label="領域" select size="small" sx={{ minWidth: 120 }}>
                {ledgerAreas.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
            </Box>
            {/* ここに既存データからの請求書発行フォームやリストを追加可能 */}
          </CardContent>
        </Card>
      )}
      {tab === 2 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700}>請求書台帳</Typography>
            <MuiTabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mt: 2, mb: 2 }}>
              <MuiTab label="経理台帳記帳" />
            </MuiTabs>
            {subTab === 0 && (
              <>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField label="請求先" size="small" value={filter.client} onChange={e => setFilter(f => ({ ...f, client: e.target.value }))} sx={{ minWidth: 160 }} />
                  <TextField label="事業部" size="small" select value={filter.division} onChange={e => setFilter(f => ({ ...f, division: e.target.value }))} sx={{ minWidth: 120 }}>
                    <MenuItem value="">すべて</MenuItem>
                    {divisionOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                  <TextField label="領域" size="small" select value={filter.area} onChange={e => setFilter(f => ({ ...f, area: e.target.value }))} sx={{ minWidth: 120 }}>
                    <MenuItem value="">すべて</MenuItem>
                    {areaOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                  <TextField label="入金ステータス" size="small" select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} sx={{ minWidth: 160 }}>
                    <MenuItem value="">すべて</MenuItem>
                    {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                  <TextField label="発行日(開始)" type="date" size="small" InputLabelProps={{ shrink: true }} value={filter.dateFrom} onChange={e => setFilter(f => ({ ...f, dateFrom: e.target.value }))} />
                  <TextField label="発行日(終了)" type="date" size="small" InputLabelProps={{ shrink: true }} value={filter.dateTo} onChange={e => setFilter(f => ({ ...f, dateTo: e.target.value }))} />
                </Box>
                <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 500 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>請求番号</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>請求日</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>請求先</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>事業部</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>領域</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>金額（税込）</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>支払期日</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>入金予定日</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>入金ステータス</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', height: 48 }}>発行者</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ledger.filter(row => {
                        if (filter.client && !row.client.includes(filter.client)) return false;
                        if (filter.division && row.division !== filter.division) return false;
                        if (filter.area && row.area !== filter.area) return false;
                        if (filter.status && row.status !== filter.status) return false;
                        if (filter.dateFrom && dayjs(row.date).isBefore(dayjs(filter.dateFrom))) return false;
                        if (filter.dateTo && dayjs(row.date).isAfter(dayjs(filter.dateTo))) return false;
                        return true;
                      }).map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.client}</TableCell>
                          <TableCell>{row.division}</TableCell>
                          <TableCell>{row.area}</TableCell>
                          <TableCell>{row.total.toLocaleString()}</TableCell>
                          <TableCell>{row.due}</TableCell>
                          <TableCell>{row.expected}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row.issuer}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      )}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default AccountingPage; 