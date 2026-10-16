import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Classes } from './pages/Classes';
import { ClassDetails } from './pages/ClassDetails';
import { Forum } from './pages/Forum';
import { PostDetails } from './pages/PostDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { RefundPolicy } from './pages/RefundPolicy';
import { AdminPortal } from './pages/AdminPortal';
import { AdminLogin } from './pages/AdminLogin';
import { TrainerPortal } from './pages/TrainerPortal';
import { TrainerLogin } from './pages/TrainerLogin';
import { GetStarted } from './pages/GetStarted';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-surface-dark text-slate-100 transition-colors">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/classes" element={<Classes />} />
                    <Route path="/classes/:id" element={<ClassDetails />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/forum/:id" element={<PostDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminPortal />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/trainer" element={<TrainerPortal />} />
                    <Route path="/trainer/login" element={<TrainerLogin />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
