'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { groupService } from '@/services/group.service';
import toast from 'react-hot-toast';

interface PhotoUploadSectionProps {
  groupId: string;
  onUploadSuccess: () => void;
}

export default function PhotoUploadSection({ groupId, onUploadSuccess }: PhotoUploadSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('photo', file));
      await groupService.uploadPhotos(groupId, formData);
      toast.success('Photos uploaded successfully!');
      setFiles([]);
      setShowUpload(false);
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload photos');
    }
    setUploading(false);
  };

  if (!showUpload) {
    return (
      <Button variant="secondary" onClick={() => setShowUpload(true)} className="text-sm">
        <Upload className="h-4 w-4 mr-2" /> Add Photos
      </Button>
    );
  }

  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
      <FileUpload
        label="Upload Group Photos"
        accept="image/*"
        multiple
        onChange={(selectedFiles) => setFiles(selectedFiles)}
      />
      <div className="flex gap-2">
        <Button onClick={handleUpload} isLoading={uploading} disabled={files.length === 0}>
          Upload {files.length > 0 ? `(${files.length})` : ''}
        </Button>
        <Button variant="secondary" onClick={() => { setShowUpload(false); setFiles([]); }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
