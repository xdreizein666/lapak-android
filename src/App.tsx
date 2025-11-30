
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SEO } from './components/SEO';
import { lazy, Suspense, useEffect } from 'react';
import { trackPageView } from './lib/ga4';

// Lazy load components for HomePage
const HeroSection = lazy(() => import('./components/HeroSection').then(module => ({ default: module.HeroSection })));
const BrandSlider = lazy(() => import('./components/BrandSlider').then(module => ({ default: module.BrandSlider })));
const AboutSection = lazy(() => import('./components/AboutSection').then(module => ({ default: module.AboutSection })));
const ProjectsSection = lazy(() => import('./components/ProjectsSection').then(module => ({ default: module.ProjectsSection })));
const BlogSection = lazy(() => import('./components/BlogSection').then(module => ({ default: module.BlogSection })));
const ContactSection = lazy(() => import('./components/ContactSection').then(module => ({ default: module.ContactSection })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const FloatingButtons = lazy(() => import('./components/FloatingButtons').then(module => ({ default: module.FloatingButtons })));

// Lazy load pages
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(module => ({ default: module.PortfolioPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })));
const StorePage = lazy(() => import('./pages/StorePage').then(module => ({ default: module.StorePage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(module => ({ default: module.TermsOfServicePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));

// Lazy load Admin Pages
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const ProjectsManagement = lazy(() => import('./pages/admin/ProjectsManagement').then(module => ({ default: module.ProjectsManagement })));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement').then(module => ({ default: module.BlogManagement })));
const MessagesManagement = lazy(() => import('./pages/admin/MessagesManagement').then(module => ({ default: module.MessagesManagement })));
const SettingsManagement = lazy(() => import('./pages/admin/SettingsManagement').then(module => ({ default: module.SettingsManagement })));
const StoreManagement = lazy(() => import('./pages/admin/StoreManagement').then(module => ({ default: module.StoreManagement })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <SEO />
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection />
        <BrandSlider />
        <AboutSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
        <Footer />
        <FloatingButtons />
      </Suspense>
    </>
  );
}

function AdminLayout() {
  return (
    <ProtectedRoute>
      <div className="pt-20"> {/* Add padding top to account for fixed header */}
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}

// Route Tracker Component
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change (excluding admin pages)
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <RouteTracker />
            <Toaster position="top-right" richColors />
            <div className="min-h-screen bg-background text-foreground scroll-smooth">
              <Header />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="projects" element={<ProjectsManagement />} />
                    <Route path="blog" element={<BlogManagement />} />
                    <Route path="store" element={<StoreManagement />} />
                    <Route path="messages" element={<MessagesManagement />} />
                    <Route path="settings" element={<SettingsManagement />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;