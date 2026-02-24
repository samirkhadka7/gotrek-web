'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trailService } from '@/services/trail.service';
import { Trail } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import FileUpload from '@/components/ui/FileUpload';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditTrailPage() {
  const router = useRouter();
  const params = useParams();
  const trailId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    difficulty: 'Easy', 
    distance: '', 
    'duration[min]': '', 
    'duration[max]': '', 
    elevation: '', 
    location: '' 
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    const loadTrail = async () => {
      try {
        const res = await trailService.getById(trailId);
        const trail: Trail = res.data?.trail || res.data;
        
        setForm({
          name: trail.name || '',
          description: trail.description || '',
          difficulty: trail.difficulty || 'Easy',
          distance: trail.distance?.toString() || '',
          'duration[min]': trail.duration?.min?.toString() || '',
          'duration[max]': trail.duration?.max?.toString() || '',
          elevation: trail.elevation?.toString() || '',
          location: trail.location || ''
        });
        
        setExistingImages(trail.images || []);
      } catch (error) {
        console.error('Failed to load trail:', error);
        toast.error('Failed to load trail data');
        router.push('/admin/trails');
      } finally {
        setFetching(false);
      }
    };

    if (trailId) {
      loadTrail();
    }
  }, [trailId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { 
      toast.error('Trail name is required'); 
      return; 
    }
    
    setLoading(true);
    try {
      const fd = new FormData();
      
      // Add all form fields
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      
      // Add new images if any
      images.forEach(img => fd.append('images', img));
      
      await trailService.update(trailId, fd);
      toast.success('Trail updated successfully!');
      router.push('/admin/trails');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update trail');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeInUp">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to trails
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Trail</h1>
        <p className="text-sm text-gray-500 mt-1">Update trail information</p>
      </div>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Trail Name" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            placeholder="Mountain Peak Trail" 
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              placeholder="Describe the trail..." 
              rows={4} 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Difficulty" 
              value={form.difficulty} 
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
              options={[
                { value: 'Easy', label: 'Easy' }, 
                { value: 'Moderate', label: 'Moderate' }, 
                { value: 'Hard', label: 'Hard' }
              ]} 
            />
            <Input 
              label="Distance (km)" 
              type="number" 
              value={form.distance} 
              onChange={e => setForm({ ...form, distance: e.target.value })} 
              placeholder="5.5" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Min Duration (hours)" 
              type="number" 
              value={form['duration[min]']} 
              onChange={e => setForm({ ...form, 'duration[min]': e.target.value })} 
              placeholder="3" 
            />
            <Input 
              label="Max Duration (hours)" 
              type="number" 
              value={form['duration[max]']} 
              onChange={e => setForm({ ...form, 'duration[max]': e.target.value })} 
              placeholder="4" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Elevation (m)" 
              type="number" 
              value={form.elevation} 
              onChange={e => setForm({ ...form, elevation: e.target.value })} 
              placeholder="800" 
            />
            <Input 
              label="Location" 
              value={form.location} 
              onChange={e => setForm({ ...form, location: e.target.value })} 
              placeholder="Langtang, Nepal" 
            />
          </div>

          {existingImages.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Existing Images</label>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5050'}/${img}`} 
                      alt={`Trail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <FileUpload 
            label="Upload New Images (optional)" 
            accept="image/*" 
            multiple 
            onChange={setImages} 
          />
          
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={loading}>
              Update Trail
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
