import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, GraduationCap, Trophy } from 'lucide-react';

export default function TimelineSection() {
  const { isEditMode } = useAuth();

  const { data: experience } = useQuery({
    queryKey: ['experience'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: education } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="timeline" className="py-20 px-4 bg-gray-900/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            My Journey
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </motion.div>

        <div className="space-y-16">
          {experience && experience.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="text-blue-500" size={32} />
                <h3 className="text-3xl font-bold text-white">Experience</h3>
              </div>

              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative pl-8 border-l-2 border-blue-500"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-blue-500 border-4 border-gray-900" />

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
                      <h4 className="text-xl font-bold text-white mb-2">{exp.role}</h4>
                      <p className="text-blue-400 font-semibold mb-2">{exp.company_name}</p>
                      <p className="text-gray-400 text-sm mb-4">{exp.duration}</p>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-cyan-500" size={32} />
                <h3 className="text-3xl font-bold text-white">Education</h3>
              </div>

              <div className="space-y-8">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative pl-8 border-l-2 border-cyan-500"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-cyan-500 border-4 border-gray-900" />

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-cyan-500 transition-colors">
                      <h4 className="text-xl font-bold text-white mb-2">{edu.degree}</h4>
                      <p className="text-cyan-400 font-semibold mb-2">{edu.college_name}</p>
                      <p className="text-gray-400 text-sm mb-2">{edu.duration}</p>
                      {edu.notes && <p className="text-gray-300">{edu.notes}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {achievements && achievements.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="text-yellow-500" size={32} />
                <h3 className="text-3xl font-bold text-white">Achievements</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <Trophy className="text-yellow-500 flex-shrink-0" size={24} />
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{achievement.title}</h4>
                        <p className="text-gray-300 mb-2">{achievement.description}</p>
                        {achievement.date && (
                          <p className="text-gray-400 text-sm">{achievement.date}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center space-x-4"
          >
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Timeline
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
