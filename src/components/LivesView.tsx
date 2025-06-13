
import { useState, useEffect, useRef } from 'react';
import { Play, Users, Heart, MessageCircle, Share, MoreVertical } from 'lucide-react';
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
      viewers: 89,
      duration: '45:20',
      avatar: 'A',
      isLive: false
    },
    {
      id: '4',
      name: 'João Silva',
      title: 'Treino na academia! 💪',
      viewers: 67,
      duration: '22:15',
      avatar: 'J',
      isLive: true
    }
  ]);

  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentLiveIndex && newIndex >= 0 && newIndex < lives.length) {
        setCurrentLiveIndex(newIndex);
        // Rolagem magnética
        container.scrollTo({
          top: newIndex * itemHeight,
          behavior: 'smooth'
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentLiveIndex, lives.length]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-black">
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {lives.map((live, index) => (
          <div 
            key={live.id} 
            className="h-screen w-full snap-start relative flex items-center justify-center"
            style={{ aspectRatio: '9/16' }}
          >
            {/* Conteúdo da Live */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md mx-auto bg-gray-900 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center relative">
                  {/* Badge AO VIVO */}
                  {live.isLive && (
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse-green flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                        AO VIVO
                      </span>
                    </div>
                  )}
                  
                  {/* Avatar da Live */}
                  <div className="text-white text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-4xl font-bold">{live.avatar}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users size={20} />
                      <span className="text-lg font-semibold">{formatNumber(live.viewers)} assistindo</span>
                    </div>
                    <p className="text-sm opacity-75">{live.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações do Lado Direito */}
            <div className="absolute right-4 bottom-32 flex flex-col space-y-6 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2">
                  {live.avatar}
                </div>
                <div className="w-6 h-6 bg-chathy-primary rounded-full flex items-center justify-center -mt-3 border-2 border-black">
                  <span className="text-black text-xs font-bold">+</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <Heart size={28} />
                  <span className="text-xs font-semibold">{formatNumber(live.viewers * 3)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                  <span className="text-xs font-semibold">{formatNumber(live.viewers / 2)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <Share size={28} />
                  <span className="text-xs font-semibold">{formatNumber(live.viewers / 5)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white hover:scale-110 transition-transform">
                  <MoreVertical size={28} />
                </Button>
              </div>
            </div>

            {/* Informações na Parte Inferior */}
            <div className="absolute bottom-4 left-4 right-20 text-white z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-bold text-lg">@{live.name.toLowerCase().replace(' ', '')}</span>
                {live.isLive && (
                  <span className="bg-red-500 px-2 py-1 rounded text-xs font-semibold">LIVE</span>
                )}
              </div>
              <p className="text-sm mb-2 leading-relaxed">{live.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivesView;
