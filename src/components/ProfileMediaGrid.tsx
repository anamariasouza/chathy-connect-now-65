
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Play } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'video' | 'carousel';
  description: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  timestamp: string;
}

interface ProfileMediaGridProps {
  media: MediaItem[];
  onMediaClick: (index: number) => void;
}

const ProfileMediaGrid = ({ media, onMediaClick }: ProfileMediaGridProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-3 gap-1 p-4">
      {media.map((item, index) => (
        <Card 
          key={item.id} 
          className="aspect-square overflow-hidden cursor-pointer relative group"
          onClick={() => onMediaClick(index)}
        >
          <div className="w-full h-full relative">
            {item.type === 'video' ? (
              <div className="w-full h-full bg-gradient-to-br from-chathy-primary to-chathy-secondary flex items-center justify-center">
                <Play size={24} className="text-white" />
              </div>
            ) : item.images && item.images.length > 0 ? (
              <img 
                src={item.images[0]} 
                alt={`Mídia de ${item.description}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            
            {/* Fallback para imagens que não carregam */}
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center" style={{ display: 'none' }}>
              <div className="text-white text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-xs font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Overlay com stats ao hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <Heart size={16} fill={item.isLiked ? 'currentColor' : 'none'} />
                  <span className="text-sm font-semibold">{formatNumber(item.likes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle size={16} />
                  <span className="text-sm font-semibold">{formatNumber(item.comments)}</span>
                </div>
              </div>
            </div>

            {/* Indicador de carrossel */}
            {item.type === 'carousel' && item.images && item.images.length > 1 && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProfileMediaGrid;
