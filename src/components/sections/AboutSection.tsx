import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

export default function AboutSection() {
  const { isEditMode } = useAuth();
  const [editData, setEditData] = useState({ description: '', quote: '' });
  const [isEditing, setIsEditing] = useState(false);

  const { data: about, refetch } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_me')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (about && isEditing) {
      setEditData({
        description: about.description,
        quote: about.quote,
      });
    }
  }, [about, isEditing]);

  const handleSave = async () => {
    if (!about) return;
    const { error } = await supabase
      .from('about_me')
      .update(editData)
      .eq('id', about.id);
    if (!error) {
      refetch();
      setIsEditing(false);
    }
  };

  if (!about) return null;

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {isEditMode && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit About
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </motion.div>

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 bg-gray-900/50 p-8 rounded-xl backdrop-blur-sm"
          >
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              rows={8}
              placeholder="About description"
            />
            <input
              type="text"
              value={editData.quote}
              onChange={(e) => setEditData({ ...editData, quote: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              placeholder="Quote"
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
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-300 leading-relaxed">
                {about.description}
              </p>

              {about.quote && (
                <div className="relative p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/20">
                  <Quote className="absolute top-4 left-4 text-blue-500/20" size={48} />
                  <p className="text-gray-300 italic pl-12">
                    {about.quote}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"
                />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-9xl font-bold text-white">
                  {about.description.charAt(0)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
