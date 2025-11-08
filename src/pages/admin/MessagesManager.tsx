import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Trash2, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    },
    onError: (error: any) => {
      alert('Error marking message as read: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
      setSelectedMessage(null);
      alert('Message deleted successfully!');
    },
    onError: (error: any) => {
      alert('Error deleting message: ' + error.message);
    }
  });

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-gray-400 mt-2">
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-3">
              {messages?.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleViewMessage(message)}
                  className={`bg-gray-800 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMessage?.id === message.id
                      ? 'border-blue-500'
                      : message.is_read
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-blue-700 hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!message.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <h3 className="font-semibold text-sm">{message.name}</h3>
                    </div>
                    <Mail size={16} className={message.is_read ? 'text-gray-600' : 'text-blue-400'} />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{message.email}</p>
                  {message.subject && (
                    <p className="text-sm text-gray-300 truncate">{message.subject}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(message.created_at).toLocaleDateString()} at{' '}
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}

              {messages?.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Mail size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-semibold">{selectedMessage.name}</h2>
                        {selectedMessage.is_read && (
                          <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full flex items-center gap-1">
                            <Check size={12} />
                            Read
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400">{selectedMessage.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Received on {new Date(selectedMessage.created_at).toLocaleDateString()} at{' '}
                        {new Date(selectedMessage.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this message?')) {
                          deleteMutation.mutate(selectedMessage.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Delete message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {selectedMessage.subject && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Subject:</h3>
                      <p className="text-lg">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Message:</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Mail size={18} />
                      Reply via Email
                    </a>
                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => markAsReadMutation.mutate(selectedMessage.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Check size={18} />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center text-gray-400">
                  <Eye size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
