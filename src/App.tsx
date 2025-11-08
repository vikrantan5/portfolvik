import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Portfolio from './pages/Portfolio';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HeroManager from './pages/admin/HeroManager';
import AboutManager from './pages/admin/AboutManager';
import SkillsManager from './pages/admin/SkillsManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import EducationManager from './pages/admin/EducationManager';
import AchievementsManager from './pages/admin/AchievementsManager';
import ContentManager from './pages/admin/ContentManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import ContactInfoManager from './pages/admin/ContactInfoManager';
import MessagesManager from './pages/admin/MessagesManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/hero" element={<HeroManager />} />
              <Route path="/admin/about" element={<AboutManager />} />
              <Route path="/admin/skills" element={<SkillsManager />} />
              <Route path="/admin/projects" element={<ProjectsManager />} />
              <Route path="/admin/experience" element={<ExperienceManager />} />
              <Route path="/admin/education" element={<EducationManager />} />
              <Route path="/admin/achievements" element={<AchievementsManager />} />
              <Route path="/admin/content" element={<ContentManager />} />
              <Route path="/admin/testimonials" element={<TestimonialsManager />} />
              <Route path="/admin/contact-info" element={<ContactInfoManager />} />
              <Route path="/admin/messages" element={<MessagesManager />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
