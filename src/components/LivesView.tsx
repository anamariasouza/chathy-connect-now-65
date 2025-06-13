
import { useState } from 'react';
import { Play, Users, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Live {
  id: string;
  name: string;
  title: string;
  viewers: number;
  duration: string;
  avatar: string;
  isLive: boolean;
}

const LivesView = () => {
  const [lives] = useState<Live[]>([
    {
      id: '1',
      name: 'Maria Silva',
      title: 'Cozinhando um bolo delicioso! 🍰',
      viewers: 45,
      duration: '15:30',
      avatar: 'M',
      isLive: true
    },
    {
      id: '2',
      name: 'Pedro Santos',
      title: 'Tocando violão ao vivo 🎸',
      viewers: 123,
      duration: '8:45',
      avatar: 'P',
      isLive: true
    },
    {
      id: '3',
      name: 'Ana Costa',
      title: 'Tutorial de maquiagem',
      viewers: 0,
      duration: '45:20',
      avatar: 'A',
      isLive: false
    }
  ]);

  return (
    <div className="flex-1 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Lives</h2>
          <Button className="gradient-bg">
            <Play size={16} className="mr-2" />
            Iniciar Live
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lives.map((live) => (
            <div key={live.id} className="bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
              {live.isLive && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold animate-pulse-green">
                    AO VIVO
                  </span>
                </div>
              )}
              
              <div className="aspect-video bg-gradient-to-br from-chathy-primary to-chathy-secondary flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                  {live.avatar}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2">{live.name}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{live.title}</p>
                
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{live.viewers}</span>
                    </div>
                    <span>{live.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="hover:text-red-400 transition-colors">
                      <Heart size={16} />
                    </button>
                    <button className="hover:text-blue-400 transition-colors">
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivesView;
