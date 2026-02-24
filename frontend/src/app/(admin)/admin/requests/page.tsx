'use client';

import { useEffect, useState } from 'react';
import { groupService } from '@/services/group.service';
import { Group, User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { CheckCircle2, XCircle, Clock, Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroupRequest {
  groupId: string;
  groupTitle: string;
  groupTrail?: string;
  requests: Array<{
    _id: string;
    userId: string | User;
    userName?: string;
    userImage?: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'declined';
    createdAt?: string;
  }>;
}

export default function ManageRequestsPage() {
  const { user } = useAuth();
  const [groupRequests, setGroupRequests] = useState<GroupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      console.log('Loading pending requests...');
      const res = await groupService.getPendingRequests();
      console.log('Response received:', res);
      
      // Backend returns data directly as an array
      const requests = Array.isArray(res.data) ? res.data : (res.data?.requests || []);
      console.log('Extracted requests:', requests);
      
      // Transform flat request list into grouped format
      if (requests && requests.length > 0) {
        const grouped = new Map<string, GroupRequest>();
        
        requests.forEach((item: any) => {
          const groupId = item.group?._id || item.groupId;
          const groupTitle = item.group?.title || 'Unknown Group';
          const groupTrail = item.group?.trail?.name || 'N/A';
          
          if (!grouped.has(groupId)) {
            grouped.set(groupId, {
              groupId,
              groupTitle,
              groupTrail,
              requests: []
            });
          }
          
          grouped.get(groupId)!.requests.push({
            _id: item._id,
            userId: item.user?._id || item.userId,
            userName: item.user?.name || 'Unknown User',
            userImage: item.user?.profileImage,
            message: item.message,
            status: item.status || 'pending',
            createdAt: item.createdAt
          });
        });
        
        console.log('Grouped requests:', Array.from(grouped.values()));
        setGroupRequests(Array.from(grouped.values()));
      } else {
        console.log('No requests found');
        setGroupRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (groupId: string, requestId: string) => {
    setProcessingId(requestId);
    try {
      await groupService.approveRequest(groupId, requestId);
      toast.success('Request approved!');
      loadRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (groupId: string, requestId: string) => {
    setProcessingId(requestId);
    try {
      await groupService.denyRequest(groupId, requestId);
      toast.success('Request denied');
      loadRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to deny request');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = groupRequests
    .map(group => ({
      ...group,
      requests: group.requests.filter(
        req => 
          group.groupTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof req.userId === 'object' && req.userId.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (req.userName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (typeof req.userId === 'string' && req.userId.includes(searchQuery))
      )
    }))
    .filter(group => group.requests.length > 0);

  const pendingCount = groupRequests.reduce((sum, g) => sum + g.requests.filter(r => r.status === 'pending').length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">Loading join requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Group Join Requests</h1>
          <p className="text-gray-600 mt-1">Manage pending member requests across all groups</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{pendingCount}</div>
          <p className="text-sm text-gray-600">Pending Requests</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by group name or member name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Requests */}
      {filteredRequests.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No pending requests found</p>
          {searchQuery && <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>}
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map(group => (
            <Card key={group.groupId} className="overflow-hidden">
              {/* Group Header */}
              <div className="bg-linear-to-r from-blue-50 to-sky-50 px-6 py-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900">{group.groupTitle}</h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {group.groupTrail}
                </div>
              </div>

              {/* Requests List */}
              <div className="divide-y">
                {group.requests.map(req => {
                  const reqUser = typeof req.userId === 'object' ? req.userId : null;
                  return (
                    <div key={req._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {(reqUser?.profileImage || req.userImage) && (
                              <img 
                                src={reqUser?.profileImage || req.userImage} 
                                alt={reqUser?.name || req.userName} 
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{reqUser?.name || req.userName || 'Unknown User'}</p>
                              <p className="text-xs text-gray-500">{reqUser?.email || 'No email'}</p>
                            </div>
                            <div className="ml-auto">
                              <Badge 
                                variant={
                                  req.status === 'pending' 
                                    ? 'warning' 
                                    : req.status === 'confirmed' 
                                    ? 'success' 
                                    : 'danger'
                                }
                              >
                                {req.status === 'pending' ? '⏳ Pending' : req.status === 'confirmed' ? '✓ Approved' : '✕ Denied'}
                              </Badge>
                            </div>
                          </div>

                          {/* Message */}
                          {req.message && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-3">
                              <p className="text-xs text-blue-600 font-medium mb-1">Message from user:</p>
                              <p className="text-sm text-blue-900 italic">&quot;{req.message}&quot;</p>
                            </div>
                          )}

                          {/* Date */}
                          {req.createdAt && (
                            <p className="text-xs text-gray-500 mt-3">
                              Requested {new Date(req.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        {req.status === 'pending' && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => handleApprove(group.groupId, req._id)}
                              isLoading={processingId === req._id}
                              className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleDeny(group.groupId, req._id)}
                              isLoading={processingId === req._id}
                              variant="danger"
                              className="whitespace-nowrap"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Deny
                            </Button>
                          </div>
                        )}

                        {req.status === 'confirmed' && (
                          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                            <CheckCircle2 className="h-5 w-5" />
                            Approved
                          </div>
                        )}

                        {req.status === 'declined' && (
                          <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
                            <XCircle className="h-5 w-5" />
                            Denied
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
