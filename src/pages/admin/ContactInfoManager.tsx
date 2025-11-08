import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Mail, Phone, MapPin, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  location: string;
  social_links: {
    github?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
}

export default function ContactInfoManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    social_links: {
      github: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      twitter: ''
    }
  });
  const [customSocial, setCustomSocial] = useState({ platform: '', url: '' });

  const { data: contactInfo, isLoading } = useQuery({
    queryKey: ['contact_info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data as ContactInfo;
    },
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        email: contactInfo.email || '',
        phone: contactInfo.phone || '',
        location: contactInfo.location || '',
        social_links: {
          github: contactInfo.social_links?.github || '',
          linkedin: contactInfo.social_links?.linkedin || '',
          youtube: contactInfo.social_links?.youtube || '',
          instagram: contactInfo.social_links?.instagram || '',
          twitter: contactInfo.social_links?.twitter || '',
          ...contactInfo.social_links
        }
      });
    }
  }, [contactInfo]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!contactInfo) return;
      const { error } = await supabase
        .from('contact_info')
        .update(data)
        .eq('id', contactInfo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_info'] });
      alert('Contact info updated successfully!');
    },
    onError: (error: any) => {
      alert('Error updating contact info: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const addCustomSocial = () => {
    if (customSocial.platform && customSocial.url) {
      setFormData({
        ...formData,
        social_links: {
          ...formData.social_links,
          [customSocial.platform.toLowerCase()]: customSocial.url
        }
      });
      setCustomSocial({ platform: '', url: '' });
    }
  };

  const removeCustomSocial = (key: string) => {
    const { [key]: removed, ...rest } = formData.social_links;
    setFormData({ ...formData, social_links: rest });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  const defaultSocials = ['github', 'linkedin', 'youtube', 'instagram', 'twitter'];
  const customSocials = Object.keys(formData.social_links).filter(key => !defaultSocials.includes(key));

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

          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Manage Contact Info
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Contact Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>

              <div className="space-y-4">
                {defaultSocials.map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {platform}
                    </label>
                    <input
                      type="url"
                      value={formData.social_links[platform] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, [platform]: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder={`https://${platform}.com/username`}
                    />
                  </div>
                ))}
              </div>

              {/* Custom Social Links */}
              {customSocials.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Custom Social Links</h3>
                  {customSocials.map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 w-32"
                      />
                      <input
                        type="url"
                        value={formData.social_links[key] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, [key]: e.target.value }
                        })}
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomSocial(key)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Social */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-medium mb-3">Add Custom Social Link</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSocial.platform}
                    onChange={(e) => setCustomSocial({ ...customSocial, platform: e.target.value })}
                    className="w-32 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="Platform"
                  />
                  <input
                    type="url"
                    value={customSocial.url}
                    onChange={(e) => setCustomSocial({ ...customSocial, url: e.target.value })}
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={addCustomSocial}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
