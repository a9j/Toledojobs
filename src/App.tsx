import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerLandingPage from './pages/EmployerLandingPage';
import PostJobPage from './pages/PostJobPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TradesLandingPage from './pages/TradesLandingPage';
import TradeCategoryPage from './pages/TradeCategoryPage';
import ContractorBenchPage from './pages/ContractorBenchPage';

export default function App() {
  const location = useLocation();
  const isTradesSection = location.pathname.startsWith('/trades');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-jobs" element={<DashboardPage />} />
          <Route path="/employers" element={<EmployerLandingPage />} />
          <Route path="/dashboard" element={<EmployerDashboard />} />
          <Route path="/dashboard/post" element={<PostJobPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/trades" element={<TradesLandingPage />} />
          <Route path="/trades/bench" element={<ContractorBenchPage />} />
          <Route path="/trades/:category" element={<TradeCategoryPage />} />
        </Routes>
      </main>
      {!isTradesSection && <Footer />}
    </div>
  );
}
