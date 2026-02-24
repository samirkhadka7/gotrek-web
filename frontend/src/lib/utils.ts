import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(date?: string): string {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function formatDuration(duration: { min: number; max: number } | string | any): string {
  if (!duration) return '';
  if (typeof duration === 'string') return duration;
  if (typeof duration === 'object' && duration.min !== undefined && duration.max !== undefined) {
    return `${duration.min}-${duration.max}h`;
  }
  return String(duration);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return 'success';
    case 'Moderate': return 'warning';
    case 'Hard': return 'danger';
    default: return 'default';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'upcoming': return 'text-blue-600 bg-blue-100';
    case 'active': return 'text-green-600 bg-green-100';
    case 'completed': return 'text-gray-600 bg-gray-100';
    case 'cancelled': return 'text-red-600 bg-red-100';
    case 'confirmed': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'declined': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
