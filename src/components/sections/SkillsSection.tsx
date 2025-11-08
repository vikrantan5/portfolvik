import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import * as Icons from 'lucide-react';

type IconName = keyof typeof Icons;

export default function SkillsSection() {
  const { isEditMode } = useAuth();
  const { theme } = useTheme();

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const categories = ['Frontend', 'Backend', 'Tools', 'Others'];

  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as IconName] as any;
    return Icon ? <Icon size={32} /> : <Icons.Code size={32} />;
  };

  return (
    <section id="skills" className={`py-20 px-4 transition-colors duration-300 relative overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </motion.div>

        <div className="space-y-12">
          {categories.map((category) => {
            const categorySkills = skills?.filter(s => s.category === category) || [];
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <h3 className={`text-xl sm:text-2xl font-semibold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className={`rounded-xl border transition-all duration-300 p-4 sm:p-6 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500'
                          : 'bg-white border-gray-300 hover:border-blue-400 shadow-sm hover:shadow-md'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-xl transition-all duration-300" />

                        <div className="relative flex flex-col items-center space-y-2 sm:space-y-3">
                          <div className="text-blue-500 group-hover:text-cyan-500 transition-colors">
                            {getIcon(skill.icon_name)}
                          </div>
                          <h4 className={`font-semibold text-center text-sm sm:text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{skill.skill_name}</h4>

                          <div className={`w-full rounded-full h-2 overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            />
                          </div>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{skill.proficiency}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Skills
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
