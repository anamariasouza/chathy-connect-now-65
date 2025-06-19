import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, MoreVertical, Upload, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';

interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  description: string;
  youtubeVideoId?: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  timestamp: string;
}

interface FeedViewProps {
  onViewProfile?: (contact: any) => void;
  audioEnabled?: boolean;
}

const FeedView = ({ onViewProfile, audioEnabled = true }: FeedViewProps) => {
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: '1',
      user: 'Maria Silva',
      avatar: 'M',
      description: 'Cozinhando um delicioso bolo de chocolate! 🍰✨ #culinaria #bolo',
      youtubeVideoId: 'rRFVWL82pNk',
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
      images: [
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=711&fit=crop'
      ],
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
      youtubeVideoId: '_83ImgNgzvc',
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
      youtubeVideoId: 'bBsErSe1VHY',
      likes: 445,
      comments: 78,
      shares: 23,
      isLiked: true,
      timestamp: 'há 8 horas'
    },
    {
      id: '5',
      user: 'Carlos Lima',
      avatar: 'C',
      description: 'Dicas de programação para iniciantes! 💻✨',
      youtubeVideoId: 'hQA-mQyWUQU',
      likes: 678,
      comments: 124,
      shares: 45,
      isLiked: false,
      timestamp: 'há 12 horas'
    },
    {
      id: '6',
      user: 'Fernanda Costa',
      avatar: 'F',
      description: 'Arte e criatividade no dia a dia! 🎨🌟',
      youtubeVideoId: 'omcoa2GUc2U',
      likes: 892,
      comments: 167,
      shares: 78,
      isLiked: true,
      timestamp: 'há 1 dia'
    }
  ]);

  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [carouselApis, setCarouselApis] = useState<Map<string, CarouselApi>>(new Map());
  const [currentSlides, setCurrentSlides] = useState<Map<string, number>>(new Map());
  const [newVideoLink, setNewVideoLink] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentVisibleVideo, setCurrentVisibleVideo] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const playedVideos = useRef<Set<string>>(new Set());

  // Detectar primeira interação do usuário
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        console.log('Primeira interação do usuário detectada no Feed');
      }
    };

    const events = ['click', 'touch', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [userInteracted]);

  // Configurar Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute('data-post-id');
          if (postId) {
            const post = posts.find(p => p.id === postId);
            if (post?.youtubeVideoId) {
              if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                // Vídeo entrou na tela com mais de 70% visível
                if (currentVisibleVideo && currentVisibleVideo !== postId) {
                  pauseVideo(currentVisibleVideo);
                  console.log('Pausando vídeo anterior:', currentVisibleVideo);
                }
                setCurrentVisibleVideo(postId);
                if (userInteracted) {
                  playVideoFromStart(postId);
                  console.log('Iniciando reprodução do vídeo:', postId);
                }
              } else if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
                // Vídeo saiu da tela ou está menos de 30% visível
                if (currentVisibleVideo === postId) {
                  pauseVideo(postId);
                  setCurrentVisibleVideo('');
                  console.log('Pausando vídeo que saiu de tela:', postId);
                }
              }
            }
          }
        });
      },
      {
        threshold: [0, 0.3, 0.7, 1],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observar todos os posts com vídeo
    const videoElements = document.querySelectorAll('[data-post-id]');
    videoElements.forEach(el => {
      const postId = el.getAttribute('data-post-id');
      const post = posts.find(p => p.id === postId);
      if (post?.youtubeVideoId && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts, userInteracted, currentVisibleVideo]);

  const playVideoFromStart = (postId: string) => {
    const iframe = iframeRefs.current.get(postId);
    if (iframe && userInteracted) {
      try {
        console.log('Enviando comandos para reproduzir vídeo:', postId, 'Audio:', audioEnabled);
        
        // Comandos sequenciais para garantir reprodução do início
        setTimeout(() => {
          iframe.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[0,true]}', '*');
        }, 100);
        
        setTimeout(() => {
          if (audioEnabled) {
            iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            iframe.contentWindow?.postMessage('{"event":"command","func":"setVolume","args":[50]}', '*');
          } else {
            iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
          }
        }, 300);
        
        setTimeout(() => {
          iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }, 500);
        
        playedVideos.current.add(postId);
      } catch (error) {
        console.log('Erro ao reproduzir vídeo:', error);
      }
    }
  };

  const pauseVideo = (postId: string) => {
    const iframe = iframeRefs.current.get(postId);
    if (iframe) {
      try {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        console.log('Vídeo pausado:', postId);
      } catch (error) {
        console.log('Erro ao pausar vídeo:', error);
      }
    }
  };

  // Controlar áudio quando a preferência muda
  useEffect(() => {
    if (currentVisibleVideo && userInteracted) {
      const iframe = iframeRefs.current.get(currentVisibleVideo);
      if (iframe) {
        try {
          if (audioEnabled) {
            iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            iframe.contentWindow?.postMessage('{"event":"command","func":"setVolume","args":[50]}', '*');
          } else {
            iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
          }
          console.log('Áudio alterado para:', audioEnabled ? 'ligado' : 'desligado');
        } catch (error) {
          console.log('Erro ao controlar áudio:', error);
        }
      }
    }
  }, [audioEnabled, currentVisibleVideo, userInteracted]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < posts.length) {
        setCurrentPostIndex(newIndex);
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

  const setCarouselApi = (postId: string, api: CarouselApi) => {
    if (!api) return;
    
    setCarouselApis(prev => new Map(prev.set(postId, api)));
    
    const updateCurrentSlide = () => {
      setCurrentSlides(prev => new Map(prev.set(postId, api.selectedScrollSnap())));
    };
    
    updateCurrentSlide();
    api.on('select', updateCurrentSlide);
  };

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAddVideo = () => {
    if (newVideoLink || newVideoDescription) {
      const videoId = newVideoLink ? extractYouTubeVideoId(newVideoLink) : undefined;
      
      const newPost: FeedPost = {
        id: Date.now().toString(),
        user: 'Você',
        avatar: 'V',
        description: newVideoDescription || 'Novo vídeo compartilhado!',
        youtubeVideoId: videoId || undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        timestamp: 'agora'
      };

      setPosts(prev => [newPost, ...prev]);
      setNewVideoLink('');
      setNewVideoDescription('');
      setIsUploadDialogOpen(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newPost: FeedPost = {
        id: Date.now().toString(),
        user: 'Você',
        avatar: 'V',
        description: newVideoDescription || 'Vídeo enviado da minha máquina!',
        youtubeVideoId: 'rRFVWL82pNk',
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        timestamp: 'agora'
      };

      setPosts(prev => [newPost, ...prev]);
      setNewVideoDescription('');
      setIsUploadDialogOpen(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleViewProfile = (post: FeedPost) => {
    const contact = {
      id: post.id,
      name: post.user,
      avatar: post.avatar,
      username: post.user.toLowerCase().replace(' ', ''),
      isOnline: true
    };
    onViewProfile?.(contact);
  };

  const handleIframeLoad = (postId: string, iframe: HTMLIFrameElement) => {
    iframeRefs.current.set(postId, iframe);
    console.log('Iframe carregado para post:', postId);
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Botão de Upload */}
      <div className="absolute top-4 right-4 z-50">
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-chathy-primary hover:bg-chathy-primary/90 rounded-full w-12 h-12 p-0">
              <Upload size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Adicionar Vídeo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">Descrição</label>
                <Input
                  placeholder="Descreva seu vídeo..."
                  value={newVideoDescription}
                  onChange={(e) => setNewVideoDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Link do YouTube Short</label>
                <Input
                  placeholder="https://youtube.com/shorts/..."
                  value={newVideoLink}
                  onChange={(e) => setNewVideoLink(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="text-center text-gray-400">ou</div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  Enviar da Máquina
                </Button>
              </div>
              <Button
                onClick={handleAddVideo}
                className="w-full bg-chathy-primary hover:bg-chathy-primary/90"
              >
                Adicionar Vídeo
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
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            className="h-screen w-full snap-start relative flex items-center justify-center"
            data-post-id={post.id}
          >
            {/* Conteúdo de Vídeo/Imagem */}
            <div className="absolute inset-0 flex items-center justify-center">
              {post.youtubeVideoId ? (
                <div className="relative h-full" style={{ width: 'calc(100vh * 9 / 16)', maxWidth: '100vw' }}>
                  <iframe
                    ref={(iframe) => iframe && handleIframeLoad(post.id, iframe)}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${post.youtubeVideoId}?autoplay=0&mute=1&loop=1&playlist=${post.youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}&start=0&end=0&cc_load_policy=0&disablekb=1&fs=0&iv_load_policy=3&autohide=1&color=white&theme=dark&vq=hd720`}
                    title={`Vídeo de ${post.user}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    className="rounded-lg"
                  />
                  
                  {/* Overlay transparente para capturar interações */}
                  <div 
                    className="absolute inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      if (!userInteracted) {
                        setUserInteracted(true);
                        if (currentVisibleVideo === post.id) {
                          playVideoFromStart(post.id);
                        }
                      }
                    }}
                    onTouchStart={() => {
                      if (!userInteracted) {
                        setUserInteracted(true);
                        if (currentVisibleVideo === post.id) {
                          playVideoFromStart(post.id);
                        }
                      }
                    }}
                  />
                </div>
              ) : post.images && post.images.length > 0 ? (
                
                <div className="h-full relative" style={{ width: 'calc(100vh * 9 / 16)', maxWidth: '100vw' }}>
                  <Carousel 
                    className="w-full h-full"
                    setApi={(api) => setCarouselApi(post.id, api)}
                  >
                    <CarouselContent className="h-full -ml-0">
                      {post.images.map((image, imageIndex) => (
                        <CarouselItem key={imageIndex} className="h-full pl-0 basis-full">
                          <div className="w-full h-full relative">
                            <img 
                              src={image} 
                              alt={`Imagem ${imageIndex + 1} de ${post.user}`}
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
                                <p className="text-sm opacity-75">Imagem {imageIndex + 1} de {post.user}</p>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Indicadores de ponto */}
                  {post.images.length > 1 && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {post.images.map((_, dotIndex) => (
                        <div
                          key={dotIndex}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            (currentSlides.get(post.id) || 0) === dotIndex
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
                <button
                  onClick={() => handleViewProfile(post)}
                  className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2 hover:scale-110 transition-transform"
                >
                  {post.avatar}
                </button>
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
