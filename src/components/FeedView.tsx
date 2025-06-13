
import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  description: string;
  videoUrl?: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  timestamp: string;
}

const FeedView = () => {
  const [posts] = useState<FeedPost[]>([
    {
      id: '1',
      user: 'Maria Silva',
      avatar: 'M',
      description: 'Cozinhando um delicioso bolo de chocolate! 🍰✨ #culinaria #bolo',
      videoUrl: 'video1.mp4',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      timestamp: 'há 2 horas'
    },
    {
      id: '2',
      user: 'Pedro Santos',
      avatar: 'P',
      description: 'Viagem incrível pelas montanhas! 🏔️',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      likes: 567,
      comments: 89,
      shares: 34,
      isLiked: true,
      timestamp: 'há 4 horas'
    },
    {
      id: '3',
      user: 'Ana Costa',
      avatar: 'A',
      description: 'Tutorial de maquiagem para o dia a dia 💄✨',
      videoUrl: 'video2.mp4',
      likes: 890,
      comments: 156,
      shares: 67,
      isLiked: false,
      timestamp: 'há 6 horas'
    },
    {
      id: '4',
      user: 'João Silva',
      avatar: 'J',
      description: 'Treino pesado na academia hoje! 💪🔥',
      videoUrl: 'video3.mp4',
      likes: 445,
      comments: 78,
      shares: 23,
      isLiked: true,
      timestamp: 'há 8 horas'
    }
  ]);

  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < posts.length) {
        setCurrentPostIndex(newIndex);
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
  }, [currentPostIndex, posts.length]);

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
    <div className="fixed inset-0 bg-black">
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            className="h-screen w-full snap-start relative flex items-center justify-center"
            style={{ aspectRatio: '9/16' }}
          >
            {/* Conteúdo de Vídeo/Imagem */}
            <div className="absolute inset-0 flex items-center justify-center">
              {post.videoUrl ? (
                <div className="relative w-full h-full max-w-md mx-auto bg-gray-900 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-chathy-primary to-chathy-secondary flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play size={32} />
                      </div>
                      <p className="text-sm opacity-75">Vídeo de {post.user}</p>
                    </div>
                  </div>
                  
                  {/* Controles de Vídeo */}
                  <div className="absolute bottom-20 left-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePlay(post.id)}
                      className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                    >
                      {playingVideos.has(post.id) ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMute(post.id)}
                      className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                    >
                      {mutedVideos.has(post.id) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                  </div>
                </div>
              ) : post.images && post.images.length > 0 ? (
                <div className="w-full h-full max-w-md mx-auto">
                  <Carousel className="w-full h-full">
                    <CarouselContent className="h-full">
                      {post.images.map((image, imageIndex) => (
                        <CarouselItem key={imageIndex} className="h-full">
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl font-bold">{imageIndex + 1}</span>
                              </div>
                              <p className="text-sm opacity-75">Imagem {imageIndex + 1} de {post.user}</p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-black/50 text-white border-none hover:bg-black/70" />
                    <CarouselNext className="right-2 bg-black/50 text-white border-none hover:bg-black/70" />
                  </Carousel>
                </div>
              ) : null}
            </div>

            {/* Ações do Lado Direito */}
            <div className="absolute right-4 bottom-32 flex flex-col space-y-6 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2">
                  {post.avatar}
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
                    post.isLiked ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <Heart size={28} fill={post.isLiked ? 'currentColor' : 'none'} className="animate-bounce-heart" />
                  <span className="text-xs font-semibold">{formatNumber(post.likes)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                  <span className="text-xs font-semibold">{formatNumber(post.comments)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-transform">
                  <Share size={28} />
                  <span className="text-xs font-semibold">{formatNumber(post.shares)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white hover:scale-110 transition-transform">
                  <MoreVertical size={28} />
                </Button>
              </div>
            </div>

            {/* Informações na Parte Inferior */}
            <div className="absolute bottom-4 left-4 right-20 text-white z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-bold text-lg">@{post.user.toLowerCase().replace(' ', '')}</span>
                <span className="text-gray-300 text-sm">{post.timestamp}</span>
              </div>
              <p className="text-sm mb-2 leading-relaxed">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedView;
