'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { getImageUrl } from '@/services/api';

interface PhotoGalleryProps {
  photos: string[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [lightboxIndex, photos.length]);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8">
        <Camera className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No photos yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <img
              src={getImageUrl(photo)}
              alt={`Group photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fadeIn" onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
            <X className="h-6 w-6" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null)); }}
                className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null)); }}
                className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <img
            src={getImageUrl(photos[lightboxIndex])}
            alt={`Group photo ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
