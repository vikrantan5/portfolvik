import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Code, 
  FolderGit2, 
  BookOpen, 
  MessageSquare, 
  Mail,
  Award,
  GraduationCap,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const adminSections = [
    { title: 'Hero Section', icon: User, path: '/admin/hero', color: 'blue' },
    { title: 'About Me', icon: User, path: '/admin/about', color: 'cyan' },
    { title: 'Skills', icon: Code, path: '/admin/skills', color: 'green' },
    { title: 'Projects', icon: FolderGit2, path: '/admin/projects', color: 'purple' },
    { title: 'Experience', icon: Briefcase, path: '/admin/experience', color: 'orange' },
    { title: 'Education', icon: GraduationCap, path: '/admin/education', color: 'pink' },
    { title: 'Achievements', icon: Award, path: '/admin/achievements', color: 'yellow' },
    { title: 'Content (Blogs/Videos)', icon: BookOpen, path: '/admin/content', color: 'red' },
    { title: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials', color: 'indigo' },
    { title: 'Contact Info', icon: Settings, path: '/admin/contact-info', color: 'teal' },
    { title: 'Messages', icon: Mail, path: '/admin/messages', color: 'gray' },
  ];

  const colorClasses: Record<string, { bg: string; hover: string; text: string }> = {
    blue: { bg: 'from-blue-500 to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700', text: 'text-blue-400' },
    cyan: { bg: 'from-cyan-500 to-cyan-600', hover: 'hover:from-cyan-600 hover:to-cyan-700', text: 'text-cyan-400' },
    green: { bg: 'from-green-500 to-green-600', hover: 'hover:from-green-600 hover:to-green-700', text: 'text-green-400' },
    purple: { bg: 'from-purple-500 to-purple-600', hover: 'hover:from-purple-600 hover:to-purple-700', text: 'text-purple-400' },
    orange: { bg: 'from-orange-500 to-orange-600', hover: 'hover:from-orange-600 hover:to-orange-700', text: 'text-orange-400' },
    pink: { bg: 'from-pink-500 to-pink-600', hover: 'hover:from-pink-600 hover:to-pink-700', text: 'text-pink-400' },
    yellow: { bg: 'from-yellow-500 to-yellow-600', hover: 'hover:from-yellow-600 hover:to-yellow-700', text: 'text-yellow-400' },
    red: { bg: 'from-red-500 to-red-600', hover: 'hover:from-red-600 hover:to-red-700', text: 'text-red-400' },
    indigo: { bg: 'from-indigo-500 to-indigo-600', hover: 'hover:from-indigo-600 hover:to-indigo-700', text: 'text-indigo-400' },
    teal: { bg: 'from-teal-500 to-teal-600', hover: 'hover:from-teal-600 hover:to-teal-700', text: 'text-teal-400' },
    gray: { bg: 'from-gray-500 to-gray-600', hover: 'hover:from-gray-600 hover:to-gray-700', text: 'text-gray-400' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Manage your portfolio content</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              View Portfolio
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            const colors = colorClasses[section.color];
            
            return (
              <motion.div
                key={section.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(section.path)}
                className="group cursor-pointer"
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-gray-900/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
