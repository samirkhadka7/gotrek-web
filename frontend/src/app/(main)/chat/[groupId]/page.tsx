'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import api from '@/services/api';
import { Message } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';

export default function ChatPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/messages/${groupId}`);
        setMessages(res.data?.data?.messages || res.data?.messages || res.data?.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [groupId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinGroup', groupId);
    socket.on('newMessage', (msg: Message) => setMessages(prev => [...prev, msg]));
    return () => { socket.emit('leaveGroup', groupId); socket.off('newMessage'); };
  }, [socket, groupId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim() || !socket) return;
    socket.emit('sendMessage', { groupId, senderId: user?._id, text: input.trim() });
    setInput('');
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fadeInUp">
      <div className="flex items-center gap-3">
        <Link href={`/groups/${groupId}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to group
        </Link>
      </div>
      <Card className="flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-emerald-500" />
          <h2 className="font-semibold text-gray-900">Group Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map((m, i) => {
            const isMe = (typeof m.sender === 'string' ? m.sender : m.sender?._id) === user?._id;
            const senderName = typeof m.sender === 'object' ? m.sender?.name : '';
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? 'bg-emerald-600 text-white rounded-2xl rounded-br-sm' : 'bg-gray-100 text-gray-700 rounded-2xl rounded-bl-sm'} px-4 py-2.5`}>
                  {!isMe && senderName && <p className="text-xs font-semibold mb-1 opacity-70">{senderName}</p>}
                  <p className="text-sm">{(m as any).text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>{timeAgo(m.createdAt)}</p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="p-4 border-t border-gray-100">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            <Button type="submit" disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
