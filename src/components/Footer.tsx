import { motion } from 'framer-motion';
import { ArrowUp, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t py-8 px-4 relative transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-900/50 border-gray-800'
        : 'bg-gray-100/50 border-gray-200'
    }`}>
      <div className="max-w-6xl mx-auto text-center">
        <p className={`flex items-center justify-center gap-2 flex-wrap text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>© 2025 Vikrant Singh</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            Built with <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" /> using React.js
          </span>
        </p>
      </div>

      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-500/50 z-50"
          whileHover={{ y: -5 }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </footer>
  );
}
