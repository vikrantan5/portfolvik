import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon_name: string;
  order_index: number;
}

export default function AchievementsManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    icon_name: 'Trophy',
    order_index: 0
  });

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Achievement[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('achievements').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      resetForm();
      alert('Achievement added successfully!');
    },
    onError: (error: any) => {
      alert('Error adding achievement: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('achievements').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      resetForm();
      alert('Achievement updated successfully!');
    },
    onError: (error: any) => {
      alert('Error updating achievement: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      alert('Achievement deleted successfully!');
    },
    onError: (error: any) => {
      alert('Error deleting achievement: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', date: '', icon_name: 'Trophy', order_index: 0 });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date,
      icon_name: achievement.icon_name,
      order_index: achievement.order_index
    });
    setEditingId(achievement.id);
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

  const iconOptions = ['Trophy', 'Award', 'Star', 'Medal', 'Crown', 'Target', 'Zap', 'Heart', 'Sparkles'];

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Manage Achievements
            </h1>
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Achievement
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
                <h2 className="text-xl font-semibold">{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none"
                    placeholder="Hackathon Winner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none"
                    placeholder="First place at National Web Dev Hackathon 2023"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date/Year</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none"
                      placeholder="2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon</label>
                    <select
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none"
                    >
                      {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {editingId ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements?.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-yellow-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Award size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{achievement.title}</h3>
                      {achievement.date && <p className="text-sm text-gray-400">{achievement.date}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this achievement?')) deleteMutation.mutate(achievement.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300">{achievement.description}</p>
              </motion.div>
            ))}
          </div>

          {achievements?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Award size={48} className="mx-auto mb-4 opacity-50" />
              <p>No achievements yet. Add your first achievement!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
