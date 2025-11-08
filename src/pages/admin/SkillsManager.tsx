import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

type IconName = keyof typeof Icons;

interface Skill {
  id: string;
  category: string;
  skill_name: string;
  icon_name: string;
  proficiency: number;
  order_index: number;
}

export default function SkillsManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'Frontend',
    skill_name: '',
    icon_name: 'Code',
    proficiency: 80,
    order_index: 0
  });

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Skill[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('skills').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      resetForm();
      alert('Skill added successfully!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('skills').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      resetForm();
      alert('Skill updated successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      alert('Skill deleted successfully!');
    },
  });

  const resetForm = () => {
    setFormData({ category: 'Frontend', skill_name: '', icon_name: 'Code', proficiency: 80, order_index: 0 });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      category: skill.category,
      skill_name: skill.skill_name,
      icon_name: skill.icon_name,
      proficiency: skill.proficiency,
      order_index: skill.order_index
    });
    setEditingId(skill.id);
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const categories = ['Frontend', 'Backend', 'Tools', 'Others'];
  const iconNames = ['Code', 'Atom', 'Box', 'FileCode', 'Palette', 'Server', 'Database', 'GitBranch', 'Figma', 'Rocket'];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Manage Skills
            </h1>
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Skill
              </button>
            )}
          </div>

          {(isAdding || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit Skill' : 'Add New Skill'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Skill Name</label>
                    <input
                      type="text"
                      required
                      value={formData.skill_name}
                      onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="React.js"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon</label>
                    <select
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {iconNames.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Proficiency ({formData.proficiency}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Update Skill' : 'Add Skill'}
                </button>
              </form>
            </motion.div>
          )}

          <div className="space-y-6">
            {categories.map(category => {
              const categorySkills = skills?.filter(s => s.category === category) || [];
              if (categorySkills.length === 0) return null;

              return (
                <div key={category} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{skill.skill_name}</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this skill?')) deleteMutation.mutate(skill.id);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">Proficiency: {skill.proficiency}%</div>
                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
