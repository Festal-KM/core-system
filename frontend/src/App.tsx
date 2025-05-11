import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AccountingPage from './pages/AccountingPage';
import ConsultingPage from './pages/ConsultingPage';
import RevitalizationPage from './pages/RevitalizationPage';
import SalesPage from './pages/SalesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="accounting" element={<AccountingPage />} />
        <Route path="consulting" element={<ConsultingPage />} />
        <Route path="revitalization" element={<RevitalizationPage />} />
        <Route path="sales" element={<SalesPage />} />
      </Route>
    </Routes>
  );
}

export default App; 