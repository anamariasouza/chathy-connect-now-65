import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, MoreVertical, Upload, Link, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

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
  onAudioToggle?: () => void;
  uploadDialogOpen?: boolean;
  onUploadDialogChange?: (open: boolean) => void;
}

const FeedView = ({ onViewProfile, audioEnabled = true, onAudioToggle, uploadDialogOpen = false, onUploadDialogChange }: FeedViewProps) => {
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: '1',
      user: 'Maria Silva',
      avatar: '/lovable-uploads/2694899a-ed7c-4d27-abc6-9722b9e5bf1c.png',
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
      avatar: '/lovable-uploads/b9c3df60-de8a-4271-907d-dfd93761ac3f.png',
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
      avatar: '/lovable-uploads/5deded1d-8e0c-45ac-9406-da311468b1d3.png',
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
      avatar: '/lovable-uploads/42c0170b-a517-45c3-b92f-9b7e8f6aac26.png',
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
      user: 'Maria Silva',
      avatar: '/lovable-uploads/2694899a-ed7c-4d27-abc6-9722b9e5bf1c.png',
      description: 'Momento especial no trabalho hoje! ✨👩‍💼',
      images: ['/lovable-uploads/2694899a-ed7c-4d27-abc6-9722b9e5bf1c.png'],
      likes: 342,
      comments: 56,
      shares: 18,
      isLiked: false,
      timestamp: 'há 10 horas'
    },
    {
      id: '6',
      user: 'Pedro Santos',
      avatar: '/lovable-uploads/b9c3df60-de8a-4271-907d-dfd93761ac3f.png',
      description: 'Novo projeto de programação! 💻🚀',
      images: ['/lovable-uploads/b9c3df60-de8a-4271-907d-dfd93761ac3f.png'],
      likes: 789,
      comments: 123,
      shares: 45,
      isLiked: true,
      timestamp: 'há 12 horas'
    },
    {
      id: '7',
      user: 'Ana Costa',
      avatar: '/lovable-uploads/5deded1d-8e0c-45ac-9406-da311468b1d3.png',
      description: 'Sessão de fotos incríveis hoje! 📸🌟',
      images: [
        '/lovable-uploads/5deded1d-8e0c-45ac-9406-da311468b1d3.png',
        'https://images.unsplash.com/photo-1494790108755-2616c27bb675?w=400&h=711&fit=crop'
      ],
      likes: 1234,
      comments: 234,
      shares: 89,
      isLiked: false,
      timestamp: 'há 14 horas'
    },
    {
      id: '8',
      user: 'João Silva',
      avatar: '/lovable-uploads/42c0170b-a517-45c3-b92f-9b7e8f6aac26.png',
      description: 'Nova música em produção! 🎵🎧',
      images: ['/lovable-uploads/42c0170b-a517-45c3-b92f-9b7e8f6aac26.png'],
      likes: 567,
      comments: 92,
      shares: 34,
      isLiked: true,
      timestamp: 'há 16 horas'
    },
    {
      id: '9',
      user: 'Carlos Lima',
      avatar: '/lovable-uploads/b3c79faf-b014-4557-b3f4-17410f8bbc27.png',
      description: 'Dicas de programação para iniciantes! 💻✨',
      youtubeVideoId: 'hQA-mQyWUQU',
      likes: 678,
      comments: 124,
      shares: 45,
      isLiked: false,
      timestamp: 'há 18 horas'
    },
    {
      id: '10',
      user: 'Fernanda Costa',
      avatar: '/lovable-uploads/9b6d18e8-018e-44fd-91cc-9a90b0724788.png',
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
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const playbackAttempts = useRef<Map<string, number>>(new Map());

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

  // Pausar todos os vídeos de forma mais eficiente
  const pauseAllVideos = () => {
    if (currentPlayingVideo && iframeRefs.current.has(currentPlayingVideo)) {
      const iframe = iframeRefs.current.get(currentPlayingVideo);
      try {
        iframe?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        console.log('Pausando vídeo:', currentPlayingVideo);
      } catch (error) {
        console.log('Erro ao pausar vídeo:', currentPlayingVideo, error);
      }
    }
    setCurrentPlayingVideo('');
  };

  // Reproduzir vídeo específico
  const playVideo = (postId: string) => {
    const iframe = iframeRefs.current.get(postId);
    if (!iframe || !userInteracted) return;

    // Evitar tentativas excessivas de reprodução
    const attempts = playbackAttempts.current.get(postId) || 0;
    if (attempts > 3) {
      console.log('Muitas tentativas de reprodução para:', postId);
      return;
    }

    playbackAttempts.current.set(postId, attempts + 1);

    // Pausar outros vídeos primeiro
    if (currentPlayingVideo && currentPlayingVideo !== postId) {
      pauseAllVideos();
    }

    try {
      console.log('Iniciando reprodução do vídeo:', postId);
      
      // Configurar volume baseado na preferência
      if (audioEnabled) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        iframe.contentWindow?.postMessage('{"event":"command","func":"setVolume","args":[50]}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      
      // Reproduzir vídeo
      iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setCurrentPlayingVideo(postId);
      
      // Resetar contador de tentativas após sucesso
      setTimeout(() => {
        playbackAttempts.current.set(postId, 0);
      }, 2000);
      
    } catch (error) {
      console.log('Erro ao reproduzir vídeo:', error);
    }
  };

  // Configurar Intersection Observer simplificado
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute('data-post-id');
          if (!postId) return;

          const post = posts.find(p => p.id === postId);
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
            console.log('Post visível:', postId);
            
            if (post?.youtubeVideoId && postId !== currentPlayingVideo) {
              // Aguardar um pouco antes de reproduzir
              setTimeout(() => {
                playVideo(postId);
              }, 500);
            }
          }
        });
      },
      {
        threshold: [0.8],
        rootMargin: '0px'
      }
    );

    // Observar todos os posts
    setTimeout(() => {
      const postElements = document.querySelectorAll('[data-post-id]');
      postElements.forEach(el => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts, currentPlayingVideo, userInteracted]);

  // Controlar áudio quando a preferência muda
  useEffect(() => {
    if (currentPlayingVideo && userInteracted) {
      const iframe = iframeRefs.current.get(currentPlayingVideo);
      if (iframe) {
        try {
          if (audioEnabled) {
            iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            iframe.contentWindow?.postMessage('{"event":"command","func":"setVolume","args":[50]}', '*');
          } else {
            iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
          }
          console.log('Controle de áudio alterado para:', audioEnabled ? 'ligado' : 'desligado');
        } catch (error) {
          console.log('Erro ao controlar áudio:', error);
        }
      }
    }
  }, [audioEnabled, currentPlayingVideo, userInteracted]);

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
      onUploadDialogChange?.(false);
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
      onUploadDialogChange?.(false);
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

  const handleVideoClick = (postId: string) => {
    console.log('Clique no vídeo detectado:', postId);
    
    if (!userInteracted) {
      setUserInteracted(true);
    }

    if (currentPlayingVideo === postId) {
      pauseAllVideos();
    } else {
      playVideo(postId);
    }
  };

  const handleIframeLoad = (postId: string, iframe: HTMLIFrameElement) => {
    iframeRefs.current.set(postId, iframe);
    console.log('Iframe carregado para post:', postId);
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Upload Button */}
      <div className="fixed top-5 right-4 z-50 md:top-21">
        <Button 
          onClick={() => onUploadDialogChange?.(true)}
          className="bg-chathy-primary hover:bg-chathy-primary/90 rounded-full w-12 h-12 p-0"
        >
          <Upload size={20} />
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={onUploadDialogChange}>
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
                    src={`https://www.youtube.com/embed/${post.youtubeVideoId}?enablejsapi=1&autoplay=0&mute=1&loop=1&playlist=${post.youtubeVideoId}&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&origin=${window.location.origin}`}
                    title={`Vídeo de ${post.user}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    className="rounded-lg"
                  />
                  
                  <div 
                    className="absolute inset-0 bg-transparent cursor-pointer z-10"
                    onClick={() => handleVideoClick(post.id)}
                    onTouchStart={() => handleVideoClick(post.id)}
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
              <div className="flex flex-col items-center relative">
                <button
                  onClick={() => handleViewProfile(post)}
                  className="w-12 h-12 rounded-full overflow-hidden bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2 hover:scale-110 transition-transform"
                >
                  <img 
                    src={post.avatar} 
                    alt={post.user}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-avatar') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <span className="fallback-avatar w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                    {post.user.charAt(0)}
                  </span>
                </button>
                
                {/* Botão de áudio posicionado sobre o avatar */}
                {post.youtubeVideoId && onAudioToggle && (
                  <button
                    onClick={onAudioToggle}
                    className={cn(
                      "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-black",
                      audioEnabled 
                        ? "bg-[#00a884] text-white"
                        : "bg-gray-600 text-white"
                    )}
                    title={audioEnabled ? "Desativar som" : "Ativar som"}
                  >
                    {audioEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  </button>
                )}
                
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
