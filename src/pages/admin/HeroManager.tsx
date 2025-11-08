import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    tagline: '',
    avatar_url: '',
    resume_url: ''
  });

  const { data: hero, isLoading } = useQuery({
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
    if (hero) {
      setFormData({
        name: hero.name || '',
        profession: hero.profession || '',
        tagline: hero.tagline || '',
        avatar_url: hero.avatar_url || '',
        resume_url: hero.resume_url || ''
      });
    }
  }, [hero]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (hero) {
        const { error } = await supabase
          .from('hero_section')
          .update(data)
          .eq('id', hero.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_section')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
      alert('Hero section updated successfully!');
    },
    onError: (error) => {
      alert('Error updating hero section: ' + error.message);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucketName = type === 'avatar' ? 'avatars' : 'resumes';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatar_url' : 'resume_url']: publicUrl
      }));
    } catch (error: any) {
      alert('Error uploading file: ' + error.message);
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Manage Hero Section
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Profession</label>
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <textarea
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Your tagline or intro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Avatar Image</label>
                <div className="flex items-center gap-4">
                  {formData.avatar_url && (
                    <img src={formData.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors">
                    <Upload size={18} />
                    Upload Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'avatar')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <Loader className="animate-spin" size={20} />}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Resume URL or Upload</label>
                <input
                  type="text"
                  value={formData.resume_url}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mb-2"
                  placeholder="https://... or upload below"
                />
                <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <Upload size={18} />
                  Upload Resume (PDF)
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleImageUpload(e, 'resume')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
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
