
import { useState, useEffect, useRef } from 'react';
import { Users, Heart, MessageCircle, Share, MoreVertical, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Live {
  id: string;
  name: string;
  title: string;
  viewers: number;
  duration: string;
  avatar: string;
  isLive: boolean;
  youtubeVideoId?: string;
}

interface LivesViewProps {
  onViewProfile?: (contact: any) => void;
}

const LivesView = ({ onViewProfile }: LivesViewProps) => {
  const [lives, setLives] = useState<Live[]>([
    {
      id: '1',
      name: 'Maria Silva',
      title: 'Cozinhando um bolo delicioso! 🍰',
      viewers: 45,
      duration: '15:30',
      avatar: 'M',
      isLive: true,
      youtubeVideoId: 'z7SiAaN4ogw'
    },
    {
      id: '2',
      name: 'Pedro Santos',
      title: 'Tocando violão ao vivo 🎸',
      viewers: 123,
      duration: '8:45',
      avatar: 'P',
      isLive: true,
      youtubeVideoId: '2BLqhS59Elc'
    },
    {
      id: '3',
      name: 'Ana Costa',
      title: 'Tutorial de maquiagem',
      viewers: 89,
      duration: '45:20',
      avatar: 'A',
      isLive: false,
      youtubeVideoId: 'HZaBTl3c5H0'
    },
    {
      id: '4',
      name: 'João Silva',
      title: 'Treino na academia! 💪',
      viewers: 67,
      duration: '22:15',
      avatar: 'J',
      isLive: true,
      youtubeVideoId: 'myS8EusS18Q'
    }
  ]);

  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);
  const [newLiveLink, setNewLiveLink] = useState('');
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [youtubeApiReady, setYoutubeApiReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());

  // Inicializar API do YouTube e detectar interação
  useEffect(() => {
    // Carregar API do YouTube
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        setYoutubeApiReady(true);
        console.log('YouTube API carregada para Lives');
      };
    } else {
      setYoutubeApiReady(true);
    }

    // Detectar primeira interação do usuário
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      console.log('Primeira interação do usuário detectada nas Lives');
      // Tentar reproduzir vídeos após interação
      setTimeout(() => {
        tryPlayCurrentLive();
      }, 500);
    };

    const events = ['click', 'touch', 'touchstart', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, []);

  const tryPlayCurrentLive = () => {
    const currentLive = lives[currentLiveIndex];
    if (currentLive?.youtubeVideoId && userInteracted) {
      const iframe = iframeRefs.current.get(currentLive.id);
      if (iframe) {
        try {
          // Tentar enviar comando de play via postMessage
          iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          console.log('Comando de play enviado para live:', currentLive.youtubeVideoId);
        } catch (error) {
          console.log('Erro ao enviar comando de play para live:', error);
        }
      }
    }
  };

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
        
        // Tentar reproduzir nova live após mudança
        setTimeout(() => {
          tryPlayCurrentLive();
        }, 500);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentLiveIndex, lives.length, userInteracted]);

  // Tentar reproduzir live quando o índice atual muda
  useEffect(() => {
    if (userInteracted) {
      setTimeout(() => {
        tryPlayCurrentLive();
      }, 1000);
    }
  }, [currentLiveIndex, userInteracted]);

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAddLive = () => {
    if (newLiveLink && newLiveTitle) {
      const videoId = extractYouTubeVideoId(newLiveLink);
      
      if (videoId) {
        const newLive: Live = {
          id: Date.now().toString(),
          name: 'Você',
          title: newLiveTitle,
          viewers: 1,
          duration: '0:00',
          avatar: 'V',
          isLive: true,
          youtubeVideoId: videoId
        };

        setLives(prev => [newLive, ...prev]);
        setNewLiveLink('');
        setNewLiveTitle('');
        setIsUploadDialogOpen(false);
      }
    }
  };

  const handleViewProfile = (live: Live) => {
    const contact = {
      id: live.id,
      name: live.name,
      avatar: live.avatar,
      username: live.name.toLowerCase().replace(' ', ''),
      isOnline: live.isLive
    };
    onViewProfile?.(contact);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleIframeLoad = (liveId: string, iframe: HTMLIFrameElement) => {
    iframeRefs.current.set(liveId, iframe);
    console.log('Iframe de live carregado para:', liveId);
    
    // Tentar reproduzir se for a live atual e o usuário já interagiu
    if (lives[currentLiveIndex]?.id === liveId && userInteracted) {
      setTimeout(() => {
        tryPlayCurrentLive();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Botão de Upload */}
      <div className="absolute top-4 right-4 z-50">
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 rounded-full w-12 h-12 p-0">
              <Upload size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Iniciar Live</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">Título da Live</label>
                <Input
                  placeholder="Digite o título da sua live..."
                  value={newLiveTitle}
                  onChange={(e) => setNewLiveTitle(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Link do YouTube</label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={newLiveLink}
                  onChange={(e) => setNewLiveLink(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button
                onClick={handleAddLive}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Iniciar Live
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                {live.youtubeVideoId ? (
                  <div className="relative w-full h-full">
                    <iframe
                      ref={(iframe) => iframe && handleIframeLoad(live.id, iframe)}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${live.youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${live.youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}&start=0&end=0&cc_load_policy=0&disablekb=1&fs=0&iv_load_policy=3&autohide=1&color=white&theme=dark&vq=hd720`}
                      title={`Live de ${live.name}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ pointerEvents: 'none' }}
                    />
                    
                    {/* Overlay transparente para capturar interações */}
                    <div 
                      className="absolute inset-0 bg-transparent cursor-pointer"
                      onClick={() => {
                        setUserInteracted(true);
                        setTimeout(() => tryPlayCurrentLive(), 100);
                      }}
                      onTouchStart={() => {
                        setUserInteracted(true);
                        setTimeout(() => tryPlayCurrentLive(), 100);
                      }}
                    />
                  </div>
                ) : (
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
                )}

                {/* Badge AO VIVO sobreposto para vídeos do YouTube */}
                {live.youtubeVideoId && live.isLive && (
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse-green flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                      AO VIVO
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações do Lado Direito */}
            <div className="absolute right-4 bottom-32 flex flex-col space-y-6 z-10">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleViewProfile(live)}
                  className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2 hover:scale-110 transition-transform"
                >
                  {live.avatar}
                </button>
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
