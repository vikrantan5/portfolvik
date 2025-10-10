import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Download, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThreeBackground from '../three/ThreeBackground';
import FloatingParticles from '../three/FloatingParticles';
import RotatingTorus from '../three/RotatingTorus';

export default function HeroSection() {
  const { isEditMode } = useAuth();
  const { theme } = useTheme();
  const [editData, setEditData] = useState({ name: '', profession: '', tagline: '' });
  const [isEditing, setIsEditing] = useState(false);

  const { data: hero, refetch } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (hero && isEditing) {
      setEditData({
        name: hero.name,
        profession: hero.profession,
        tagline: hero.tagline,
      });
    }
  }, [hero, isEditing]);

  const handleSave = async () => {
    if (!hero) return;
    const { error } = await supabase
      .from('hero_section')
      .update(editData)
      .eq('id', hero.id);
    if (!error) {
      refetch();
      setIsEditing(false);
    }
  };

  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!hero?.tagline) return;

    if (currentIndex < hero.tagline.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + hero.tagline[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, hero?.tagline]);

  if (!hero) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <ThreeBackground>
        <FloatingParticles count={150} />
        <RotatingTorus />
      </ThreeBackground>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {isEditMode && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Hero
          </button>
        )}

        {isEditing ? (
          <div className={`space-y-4 p-6 sm:p-8 rounded-xl backdrop-blur-sm ${
            theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'
          }`}>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              placeholder="Name"
            />
            <input
              type="text"
              value={editData.profession}
              onChange={(e) => setEditData({ ...editData, profession: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              placeholder="Profession"
            />
            <textarea
              value={editData.tagline}
              onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              rows={3}
              placeholder="Tagline"
            />
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 rounded-full overflow-hidden shadow-lg shadow-blue-500/50"
              >
                {hero.avatar_url ? (
                  <img
                    src={hero.avatar_url}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-4xl sm:text-5xl font-bold text-white">
                    {hero.name.charAt(0)}
                  </div>
                )}
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent px-4"
            >
              {hero.name}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-xl sm:text-2xl md:text-3xl mb-6 px-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {hero.profession}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`text-base sm:text-lg md:text-xl mb-12 min-h-[60px] px-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {displayedText}
              <span className="animate-pulse">|</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#contact"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <Mail size={20} />
                Hire Me
              </a>
              {hero.resume_url && (
                <a
                  href={hero.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700'
                      : 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  <Download size={20} />
                  View Resume
                </a>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
