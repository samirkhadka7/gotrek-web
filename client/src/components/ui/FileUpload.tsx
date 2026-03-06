'use client';

import { useRef, useState, useEffect } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileInfo {
  name: string;
  size: number;
  url?: string;
}

interface FileUploadProps { onFilesSelected?: (files: FileList) => void; onChange?: (files: File[]) => void; accept?: string; multiple?: boolean; label?: string; }

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export default function FileUpload({ onFilesSelected, onChange, accept = 'image/*', multiple = false, label = 'Upload Files' }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    return () => {
      files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    };
  }, [files]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      const fileInfos = fileArray.map((f) => ({
        name: f.name,
        size: f.size,
        url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      }));
      setFiles(fileInfos);
      onFilesSelected?.(e.target.files);
      onChange?.(fileArray);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div onClick={() => ref.current?.click()} className={cn('border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200', 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30')}>
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                {f.url ? (
                  <img src={f.url} alt={f.name} className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <FileImage className="h-8 w-8 text-blue-500" />
                )}
                <div className="text-left">
                  <p className="text-sm text-blue-700 font-medium">{f.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Click to upload <span className="text-gray-400">or drag and drop</span></p>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
    </div>
  );
}
// TODO: add drag and drop file upload support
