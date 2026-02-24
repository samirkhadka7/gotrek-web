'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { groupService } from '@/services/group.service';
import { trailService } from '@/services/trail.service';
import { Trail, Group } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGroup, setFetchingGroup] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    trail: '', 
    date: '', 
    maxSize: '10', 
    meetingPoint: '', 
    requirements: '' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupRes, trailRes] = await Promise.all([
          groupService.getById(params.id as string),
          trailService.getAll()
        ]);
        
        const groupData = groupRes.data as Group;
        setTrails(trailRes.data?.trails || trailRes.data || []);
        
        // Check if user is leader or admin
        const leaderId = typeof groupData.leader === 'string' ? groupData.leader : groupData.leader?._id;
        const isAdmin = user?.role === 'admin';
        if (!isAdmin && leaderId !== user?._id) {
          toast.error('You are not authorized to edit this group');
          router.push(`/groups/${params.id}`);
          return;
        }

        setForm({
          title: groupData.title || '',
          description: groupData.description || '',
          trail: typeof groupData.trail === 'object' ? groupData.trail._id : groupData.trail || '',
          date: groupData.date ? new Date(groupData.date).toISOString().split('T')[0] : '',
          maxSize: groupData.maxSize?.toString() || '10',
          meetingPoint: typeof groupData.meetingPoint === 'object' ? groupData.meetingPoint.description || '' : groupData.meetingPoint || '',
          requirements: Array.isArray(groupData.requirements) ? groupData.requirements.join(', ') : ''
        });
        
        setExistingPhotos(groupData.photos || []);
      } catch (error) {
        toast.error('Failed to load group details');
        router.push('/groups');
      } finally {
        setFetchingGroup(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id, user, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = photos.length + existingPhotos.length + files.length;
    
    if (totalPhotos > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    
    setPhotos(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewPhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Group title is required'); return; }
    if (!form.date) { toast.error('Date is required'); return; }
    if (!form.trail) { toast.error('Please select a trail'); return; }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('trail', form.trail);
      formData.append('date', form.date);
      formData.append('maxSize', form.maxSize);
      
      if (form.meetingPoint) {
        formData.append('meetingPoint', JSON.stringify({ description: form.meetingPoint }));
      }
      
      if (form.requirements) {
        formData.append('requirements', JSON.stringify(form.requirements.split(',').map(r => r.trim())));
      }
      
      // Append existing photos (URLs to keep)
      if (existingPhotos.length > 0) {
        formData.append('existingPhotos', JSON.stringify(existingPhotos));
      }
      
      // Append new photos
      photos.forEach(photo => {
        formData.append('photo', photo);
      });
      
      await groupService.update(params.id as string, formData);
      toast.success('Group updated successfully!');
      router.push(`/groups/${params.id}`);
    } catch (error: any) { 
      toast.error(error?.response?.data?.message || 'Failed to update group'); 
    }
    setLoading(false);
  };

  if (fetchingGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading group details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Group</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Group Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <Select 
              label="Trail *" 
              value={form.trail} 
              onChange={e => setForm({ ...form, trail: e.target.value })} 
              required
            >
              <option value="">Select a trail</option>
              {trails.map(trail => (
                <option key={trail._id} value={trail._id}>{trail.name}</option>
              ))}
            </Select>
            
            <Input label="Date *" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <Input label="Max Size" type="number" value={form.maxSize} onChange={e => setForm({ ...form, maxSize: e.target.value })} min="2" max="20" />
            <Input label="Meeting Point" value={form.meetingPoint} onChange={e => setForm({ ...form, meetingPoint: e.target.value })} placeholder="e.g., Parking lot at trail entrance" />
            <Input label="Requirements (comma-separated)" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder="e.g., Water bottle, Trekking boots" />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Group Photos</label>
              
              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Current Photos</p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}${photo}`} 
                          alt={`Existing ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg" 
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Photos Upload */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-600"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Add more photos (max {10 - existingPhotos.length} more)</span>
                  <span className="text-xs text-gray-400">PNG, JPG up to 5MB each</span>
                </button>
              </div>
              
              {/* New Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">New Photos to Add</p>
                  <div className="grid grid-cols-3 gap-3">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} alt={`New ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button type="button" onClick={() => router.back()} className="flex-1 bg-gray-500 hover:bg-gray-600">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" isLoading={loading}>
                Update Group
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
