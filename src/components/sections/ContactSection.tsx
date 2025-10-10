import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Mail, MapPin, Phone, Github, Linkedin, Youtube, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import ThreeBackground from '../three/ThreeBackground';
import GlowingOrbs from '../three/GlowingOrbs';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { data: contact } = useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const { error } = await supabase.from('contact_messages').insert([formData]);

    if (!error) {
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }

    setSending(false);
  };

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
    instagram: Instagram,
    twitter: Twitter,
  };

  const socialLinks = contact?.social_links as Record<string, string> || {};

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      <ThreeBackground>
        <GlowingOrbs />
      </ThreeBackground>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contact?.email && (
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Mail className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href={`mailto:${contact.email}`} className="hover:text-blue-400 transition-colors">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.phone && (
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Phone className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-400 transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.location && (
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <MapPin className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p>{contact.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Follow Me</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  const Icon = socialIcons[platform];
                  if (!Icon || !url) return null;

                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
