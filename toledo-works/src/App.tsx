import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetailPage from './pages/JobDetailPage';
import Trades from './pages/Trades';
import TradeCategoryPage from './pages/TradeCategoryPage';
import ContractorBench from './pages/ContractorBench';
import EmployerLanding from './pages/EmployerLanding';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import PostJob from './pages/PostJob';
import SeekerProfilePage from './pages/SeekerProfilePage';
import SeekerDashboardPage from './pages/SeekerDashboardPage';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/trades/:category" element={<TradeCategoryPage />} />
                <Route path="/trades/bench" element={<ContractorBench />} />
                <Route path="/employers" element={<EmployerLanding />} />
                <Route path="/dashboard" element={<EmployerDashboardPage />} />
                <Route path="/dashboard/post" element={<PostJob />} />
                <Route path="/profile" element={<SeekerProfilePage />} />
                <Route path="/my-jobs" element={<SeekerDashboardPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
            <Toaster position="bottom-center" />
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
