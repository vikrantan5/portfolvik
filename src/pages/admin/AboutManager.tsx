import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    quote: '',
    photo_url: ''
  });

  const { data: about, isLoading } = useQuery({
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
    if (about) {
      setFormData({
        description: about.description || '',
        quote: about.quote || '',
        photo_url: about.photo_url || ''
      });
    }
  }, [about]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (about) {
        const { error } = await supabase
          .from('about_me')
          .update(data)
          .eq('id', about.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_me')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      alert('About section updated successfully!');
    },
    onError: (error) => {
      alert('Error updating about section: ' + error.message);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Manage About Section
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Tell about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quote (Optional)</label>
                <input
                  type="text"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Your favorite quote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {formData.photo_url && (
                    <img src={formData.photo_url} alt="Photo" className="w-24 h-24 rounded-lg object-cover" />
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors">
                    <Upload size={18} />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <Loader className="animate-spin" size={20} />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending || uploading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
