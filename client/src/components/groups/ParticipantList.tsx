import { User } from '@/types';
import { Crown, BadgeCheck } from 'lucide-react';
import { getImageUrl } from '@/services/api';

interface Props { participants: User[]; leaderId?: string; }

export default function ParticipantList({ participants, leaderId }: Props) {
  // Filter out null/undefined participants (deleted users)
  const validParticipants = participants.filter((p): p is User => p !== null && p !== undefined);

  return (
    <div className="space-y-2">
      {validParticipants.map((p) => (
        <div key={p._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {p.profileImage ? (
              <img src={getImageUrl(p.profileImage)} alt={p.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              p.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
              {p.role === 'guide' && (
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.guideProfile?.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  <BadgeCheck className="h-3 w-3" /> Guide
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{p.email}</p>
          </div>
          {p._id === leaderId && (
            <div className="flex items-center gap-1 text-amber-500">
              <Crown className="h-4 w-4" />
              <span className="text-xs font-medium">Leader</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
