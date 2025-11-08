import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, BookOpen, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

interface Content {
  id: string;
  title: string;
  link: string;
  thumbnail_url: string;
  type: 'blog' | 'youtube';
  published_date: string;
  order_index: number;
}

export default function ContentManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    thumbnail_url: '',
    type: 'blog' as 'blog' | 'youtube',
    published_date: new Date().toISOString().split('T')[0],
    order_index: 0
  });

  const { data: contents, isLoading } = useQuery({
    queryKey: ['blogs_youtube'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs_youtube')
        .select('*')
        .order('published_date', { ascending: false });
      if (error) throw error;
      return data as Content[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('blogs_youtube').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs_youtube'] });
      resetForm();
      alert('Content added successfully!');
    },
    onError: (error: any) => {
      alert('Error adding content: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('blogs_youtube').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs_youtube'] });
      resetForm();
      alert('Content updated successfully!');
    },
    onError: (error: any) => {
      alert('Error updating content: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blogs_youtube').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs_youtube'] });
      alert('Content deleted successfully!');
    },
    onError: (error: any) => {
      alert('Error deleting content: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      link: '',
      thumbnail_url: '',
      type: 'blog',
      published_date: new Date().toISOString().split('T')[0],
      order_index: 0
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (content: Content) => {
    setFormData({
      title: content.title,
      link: content.link,
      thumbnail_url: content.thumbnail_url || '',
      type: content.type,
      published_date: content.published_date,
      order_index: content.order_index
    });
    setEditingId(content.id);
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

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  const blogs = contents?.filter(c => c.type === 'blog') || [];
  const videos = contents?.filter(c => c.type === 'youtube') || [];

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Manage Content (Blogs/Videos)
            </h1>
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Content
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
                <h2 className="text-xl font-semibold">{editingId ? 'Edit Content' : 'Add New Content'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="blog"
                        checked={formData.type === 'blog'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'blog' | 'youtube' })}
                        className="w-4 h-4"
                      />
                      <BookOpen size={18} />
                      Blog Post
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="youtube"
                        checked={formData.type === 'youtube'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'blog' | 'youtube' })}
                        className="w-4 h-4"
                      />
                      <Youtube size={18} />
                      YouTube Video
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Getting Started with Three.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link/URL</label>
                  <input
                    type="url"
                    required
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="https://youtube.com/watch?v=... or https://blog.com/post"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL (optional)</label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Published Date</label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {editingId ? 'Update Content' : 'Add Content'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Blogs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={24} />
              Blog Posts ({blogs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-red-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{content.title}</h3>
                      <p className="text-sm text-gray-400">{new Date(content.published_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(content)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this content?')) deleteMutation.mutate(content.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <a
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all"
                  >
                    {content.link}
                  </a>
                </motion.div>
              ))}
            </div>
            {blogs.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No blog posts yet.</p>
              </div>
            )}
          </div>

          {/* YouTube Videos Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Youtube size={24} />
              YouTube Videos ({videos.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-red-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{content.title}</h3>
                      <p className="text-sm text-gray-400">{new Date(content.published_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(content)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this content?')) deleteMutation.mutate(content.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <a
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all"
                  >
                    {content.link}
                  </a>
                </motion.div>
              ))}
            </div>
            {videos.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No YouTube videos yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
