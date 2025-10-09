import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Youtube, BookOpen, ExternalLink } from 'lucide-react';

export default function ContentSection() {
  const { isEditMode } = useAuth();

  const { data: content } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs_youtube')
        .select('*')
        .order('published_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="content" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Blogs & Videos
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content?.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group block"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 overflow-hidden">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.type === 'youtube' ? (
                        <Youtube size={64} className="text-red-500" />
                      ) : (
                        <BookOpen size={64} className="text-blue-500" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm font-semibold text-white flex items-center gap-1">
                    {item.type === 'youtube' ? (
                      <>
                        <Youtube size={14} />
                        Video
                      </>
                    ) : (
                      <>
                        <BookOpen size={14} />
                        Blog
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{new Date(item.published_date).toLocaleDateString()}</span>
                    <ExternalLink size={16} className="group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Content
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
