import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, MessageSquare, Star, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar_url: string;
  rating: number;
  is_visible: boolean;
  order_index: number;
}

export default function TestimonialsManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    feedback: '',
    avatar_url: '',
    rating: 5,
    is_visible: true,
    order_index: 0
  });

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('testimonials').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
      alert('Testimonial added successfully!');
    },
    onError: (error: any) => {
      alert('Error adding testimonial: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase.from('testimonials').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
      alert('Testimonial updated successfully!');
    },
    onError: (error: any) => {
      alert('Error updating testimonial: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      alert('Testimonial deleted successfully!');
    },
    onError: (error: any) => {
      alert('Error deleting testimonial: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      feedback: '',
      avatar_url: '',
      rating: 5,
      is_visible: true,
      order_index: 0
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      feedback: testimonial.feedback,
      avatar_url: testimonial.avatar_url || '',
      rating: testimonial.rating,
      is_visible: testimonial.is_visible,
      order_index: testimonial.order_index
    });
    setEditingId(testimonial.id);
    setIsAdding(false);
  };

  const toggleVisibility = (testimonial: Testimonial) => {
    updateMutation.mutate({
      id: testimonial.id,
      data: { is_visible: !testimonial.is_visible }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Manage Testimonials
            </h1>
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Testimonial
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
                <h2 className="text-xl font-semibold">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role/Title</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none"
                      placeholder="CTO at Tech Corp"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Feedback</label>
                  <textarea
                    required
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none"
                    placeholder="Write the testimonial feedback here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Avatar URL (optional)</label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: num })}
                          className={`p-2 rounded ${formData.rating >= num ? 'text-yellow-400' : 'text-gray-600'}`}
                        >
                          <Star size={24} fill={formData.rating >= num ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Visibility</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_visible}
                        onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                        className="w-5 h-5"
                      />
                      Visible on portfolio
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials?.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-800 border rounded-xl p-6 transition-all ${
                  testimonial.is_visible ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-800 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {testimonial.avatar_url ? (
                      <img src={testimonial.avatar_url} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <MessageSquare size={24} className="text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      {testimonial.role && <p className="text-sm text-gray-400">{testimonial.role}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisibility(testimonial)}
                      className="text-gray-400 hover:text-white"
                      title={testimonial.is_visible ? 'Hide' : 'Show'}
                    >
                      {testimonial.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this testimonial?')) deleteMutation.mutate(testimonial.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{testimonial.feedback}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}
                      fill={i < testimonial.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {testimonials?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No testimonials yet. Add your first testimonial!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
