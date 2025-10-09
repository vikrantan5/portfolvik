import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Download, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const { isEditMode } = useAuth();
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
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        {isEditMode && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Hero
          </button>
        )}

        {isEditing ? (
          <div className="space-y-4 bg-gray-900/50 p-8 rounded-xl backdrop-blur-sm">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              placeholder="Name"
            />
            <input
              type="text"
              value={editData.profession}
              onChange={(e) => setEditData({ ...editData, profession: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              placeholder="Profession"
            />
            <textarea
              value={editData.tagline}
              onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white"
              >
                {hero.name.charAt(0)}
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
            >
              {hero.name}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-300 mb-6"
            >
              {hero.profession}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-400 mb-12 min-h-[60px]"
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
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Hire Me
              </a>
              {hero.resume_url && (
                <a
                  href={hero.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-700"
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
