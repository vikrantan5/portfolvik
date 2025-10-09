import { motion } from 'framer-motion';
import { ArrowUp, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    <footer className="bg-gray-900/50 border-t border-gray-800 py-8 px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-400 flex items-center justify-center gap-2 flex-wrap">
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
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </footer>
  );
}
