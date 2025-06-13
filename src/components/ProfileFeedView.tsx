
import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX, MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';

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

interface ProfileFeedViewProps {
  media: MediaItem[];
  initialIndex: number;
  userName: string;
  onClose: () => void;
}

const ProfileFeedView = ({ media, initialIndex, userName, onClose }: ProfileFeedViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [carouselApis, setCarouselApis] = useState<Map<string, CarouselApi>>(new Map());
  const [currentSlides, setCurrentSlides] = useState<Map<string, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < media.length) {
        setCurrentIndex(newIndex);
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
      // Posicionar no índice inicial
      container.scrollTo({
        top: initialIndex * container.clientHeight,
        behavior: 'auto'
      });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, media.length, initialIndex]);

  const setCarouselApi = (postId: string, api: CarouselApi) => {
    if (!api) return;
    
    setCarouselApis(prev => new Map(prev.set(postId, api)));
    
    const updateCurrentSlide = () => {
      setCurrentSlides(prev => new Map(prev.set(postId, api.selectedScrollSnap())));
    };
    
    updateCurrentSlide();
    api.on('select', updateCurrentSlide);
  };

  const togglePlay = (postId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleMute = (postId: string) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header com botão voltar */}
      <div className="absolute top-4 left-4 z-60">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft size={20} />
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {media.map((item, index) => (
          <div 
            key={item.id} 
            className="h-screen w-full snap-start relative flex items-center justify-center"
          >
            {/* Conteúdo de Vídeo/Imagem */}
            <div className="absolute inset-0 flex items-center justify-center">
              {item.type === 'video' ? (
                <div className="relative h-full" style={{ width: 'calc(100vh * 9 / 16)', maxWidth: '100vw' }}>
                  <div className="w-full h-full bg-gradient-to-br from-chathy-primary to-chathy-secondary flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play size={32} />
                      </div>
                      <p className="text-sm opacity-75">Vídeo de {userName}</p>
                    </div>
                  </div>
                  
                  {/* Controles de Vídeo */}
                  <div className="absolute bottom-20 left-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePlay(item.id)}
                      className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                    >
                      {playingVideos.has(item.id) ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMute(item.id)}
                      className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                    >
                      {mutedVideos.has(item.id) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                  </div>
                </div>
              ) : item.images && item.images.length > 0 ? (
                <div className="h-full relative" style={{ width: 'calc(100vh * 9 / 16)', maxWidth: '100vw' }}>
                  <Carousel 
                    className="w-full h-full"
                    setApi={(api) => setCarouselApi(item.id, api)}
                  >
                    <CarouselContent className="h-full -ml-0">
                      {item.images.map((image, imageIndex) => (
                        <CarouselItem key={imageIndex} className="h-full pl-0 basis-full">
                          <div className="w-full h-full relative">
                            <img 
                              src={image} 
                              alt={`Imagem ${imageIndex + 1} de ${userName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center" style={{ display: 'none' }}>
                              <div className="text-white text-center">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                                  <span className="text-2xl font-bold">{imageIndex + 1}</span>
                                </div>
                                <p className="text-sm opacity-75">Imagem {imageIndex + 1} de {userName}</p>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Indicadores de ponto */}
                  {item.images.length > 1 && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {item.images.map((_, dotIndex) => (
                        <div
                          key={dotIndex}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            (currentSlides.get(item.id) || 0) === dotIndex
                              ? 'bg-white'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Ações do Lado Direito */}
            <div className="absolute right-4 bottom-32 flex flex-col space-y-6 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="w-6 h-6 bg-chathy-primary rounded-full flex items-center justify-center -mt-3 border-2 border-black">
                  <span className="text-black text-xs font-bold">+</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 hover:scale-110 transition-transform ${
                    item.isLiked ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <Heart size={28} fill={item.isLiked ? 'currentColor' : 'none'} />
                  <span className="text-xs font-semibold">{formatNumber(item.likes)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                  <span className="text-xs font-semibold">{formatNumber(item.comments)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <Share size={28} />
                  <span className="text-xs font-semibold">{formatNumber(item.shares)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white hover:scale-110 transition-transform">
                  <MoreVertical size={28} />
                </Button>
              </div>
            </div>

            {/* Informações na Parte Inferior */}
            <div className="absolute bottom-4 left-4 right-20 text-white z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-bold text-lg">@{userName.toLowerCase().replace(' ', '')}</span>
                <span className="text-gray-300 text-sm">{item.timestamp}</span>
              </div>
              <p className="text-sm mb-2 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFeedView;
