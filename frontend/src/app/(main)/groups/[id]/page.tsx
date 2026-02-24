'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { groupService } from '@/services/group.service';
import { Group } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import ParticipantList from '@/components/groups/ParticipantList';
import PhotoGallery from '@/components/groups/PhotoGallery';
import PhotoUploadSection from '@/components/groups/PhotoUploadSection';
import { getImageUrl } from '@/services/api';
import { ArrowLeft, Users, MessageCircle, MapPin, LogOut, UserPlus, Edit, X, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const load = async () => {
    try {
      const res = await groupService.getById(id as string);
      const groupData = res.data?.group || res.data;
      console.log('[Group Detail] Response:', res.data);
      console.log('[Group Detail] Group data:', groupData);
      console.log('[Group Detail] Photos:', groupData?.photos);
      setGroup(groupData);
      setImageTimestamp(Date.now()); // Update timestamp when group loads
    } catch (err) { 
      console.error('[Group Detail] Error loading group:', err);
      toast.error('Group not found'); 
      router.push('/groups'); 
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  // Check if user is confirmed member (not pending)
  const isMember = group?.participants?.some(p => {
    if (!p.user) return false;
    const userId = typeof p.user === 'string' ? p.user : p.user._id;
    return userId === user?._id && p.status === 'confirmed';
  });
  
  // Check if user has pending join request
  const hasPendingRequest = group?.participants?.some(p => {
    if (!p.user) return false;
    const userId = typeof p.user === 'string' ? p.user : p.user._id;
    return userId === user?._id && p.status === 'pending';
  });
  
  const isLeader = group?.leader && (typeof group.leader === 'string' ? group.leader : group.leader._id) === user?._id;

  const handleJoinRequest = async () => {
    setSubmitting(true);
    try {
      await groupService.requestToJoin(id as string, { message: joinMessage });
      toast.success('Join request sent!');
      setShowJoinDialog(false);
      setJoinMessage('');
      load();
    } catch (error: any) { 
      toast.error(error?.response?.data?.message || 'Failed to send join request'); 
    }
    setSubmitting(false);
  };

  const handleLeave = async () => {
    try {
      await groupService.leaveGroup(id as string);
      toast.success('Left the group');
      load();
    } catch (error: any) { 
      toast.error(error?.response?.data?.message || 'Failed to leave group'); 
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${group?.title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await groupService.delete(id as string);
      toast.success('Group deleted successfully');
      router.push('/groups');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete group');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!group) return null;

  return (
    <div className="space-y-6 animate-fadeInUp">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to groups
      </button>
      <div className="relative h-56 rounded-2xl overflow-hidden">
        <img 
          src={
            group.photos && group.photos[0] 
              ? `${getImageUrl(group.photos[0])}?t=${imageTimestamp}` 
              : 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop'
          } 
          alt={group.title} 
          className="w-full h-full object-cover"
          onLoad={() => console.log('[Group Detail] Image loaded from:', group.photos?.[0])}
          onError={(e) => {
            console.error('[Group Detail] Image failed to load:', group.photos?.[0], 'URL was:', (e.target as HTMLImageElement).src);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <Badge variant="info">{group.status || 'Active'}</Badge>
          <h1 className="text-3xl font-bold text-white mt-2">{group.title}</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-sm text-gray-600">{group.description}</p>
            {group.trail && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-emerald-500" />
                Trail: {typeof group.trail === 'string' ? group.trail : group.trail.name}
              </div>
            )}
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
              <span className="text-sm text-gray-400">{group.photos?.length || 0} photos</span>
            </div>
            <PhotoGallery photos={group.photos || []} />
            {(isMember || isLeader) && (
              <div className="mt-4">
                <PhotoUploadSection groupId={group._id} onUploadSuccess={load} />
              </div>
            )}
          </Card>
          <div className="flex gap-3">
            {!isMember && !hasPendingRequest && <Button onClick={() => setShowJoinDialog(true)}><UserPlus className="h-4 w-4 mr-2" /> Join Group</Button>}
            {hasPendingRequest && <Button disabled className="bg-amber-500 hover:bg-amber-500 cursor-not-allowed"><Clock className="h-4 w-4 mr-2" /> Pending Approval</Button>}
            {isMember && !isLeader && <Button variant="danger" onClick={handleLeave}><LogOut className="h-4 w-4 mr-2" /> Leave Group</Button>}
            {isMember && (
              <Link href={`/chat/${group._id}`}>
                <Button variant="secondary"><MessageCircle className="h-4 w-4 mr-2" /> Group Chat</Button>
              </Link>
            )}
          </div>

          {/* Join Dialog */}
          {showJoinDialog && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="max-w-md w-full animate-scaleUp">
                <Card className="p-0 overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="bg-linear-to-br from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 text-white rounded-full p-2.5">
                          <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Join {group.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Send a request to the group leader</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowJoinDialog(false)} 
                        className="text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full p-1.5 transition-all"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Trail Info */}
                    {group.trail && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-600 font-medium">Trail</p>
                          <p className="text-sm text-blue-900">{typeof group.trail === 'string' ? group.trail : group.trail.name}</p>
                        </div>
                      </div>
                    )}

                    {/* Date Info */}
                    {group.date && (
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-start gap-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <p className="text-xs text-purple-600 font-medium">Group Date</p>
                          <p className="text-sm text-purple-900">{new Date(group.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                    )}

                    {/* Message Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">Introduce Yourself</label>
                      <textarea 
                        value={joinMessage}
                        onChange={(e) => setJoinMessage(e.target.value)}
                        placeholder="Share why you'd like to join this group (optional)..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none transition-all"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-2">💡 Tip: A friendly message increases your chances of approval!</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowJoinDialog(false)} 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleJoinRequest} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                      isLoading={submitting}
                    >
                      {submitting ? 'Sending...' : 'Send Request'}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Members</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="h-4 w-4" /> 
              {group.participants?.filter(p => p.status === 'confirmed').length || 0}
            </div>
          </div>
          <ParticipantList 
            participants={group.participants
              ?.filter(p => p.status === 'confirmed')
              .map(p => (typeof p.user === 'object' ? p.user : p.user) as import('@/types').User)
              .filter((p): p is import('@/types').User => typeof p !== 'string') || []} 
            leaderId={typeof group.leader === 'string' ? group.leader : group.leader?._id} 
          />
        </Card>
      </div>
    </div>
  );
}
