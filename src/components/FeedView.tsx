
import { useState } from 'react';
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
    }
  ]);

  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());

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
    <div className="flex-1 bg-black overflow-y-auto">
      <div className="max-w-md mx-auto bg-black">
        {posts.map((post) => (
          <div key={post.id} className="relative h-screen flex flex-col bg-black">
            {/* Video/Image Content */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
              {post.videoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-full h-4/5 bg-gradient-to-br from-chathy-primary to-chathy-secondary rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play size={32} />
                      </div>
                      <p className="text-sm opacity-75">Vídeo de {post.user}</p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePlay(post.id)}
                      className="bg-black/50 text-white hover:bg-black/70"
                    >
                      {playingVideos.has(post.id) ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMute(post.id)}
                      className="bg-black/50 text-white hover:bg-black/70"
                    >
                      {mutedVideos.has(post.id) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                  </div>
                </div>
              ) : post.images && post.images.length > 0 ? (
                <Carousel className="w-full h-4/5">
                  <CarouselContent>
                    {post.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                              <span className="text-2xl font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm opacity-75">Imagem {index + 1} de {post.user}</p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              ) : null}
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold mb-2">
                  {post.avatar}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 ${
                    post.isLiked ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <Heart size={24} fill={post.isLiked ? 'currentColor' : 'none'} />
                  <span className="text-xs">{formatNumber(post.likes)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white">
                  <MessageCircle size={24} />
                  <span className="text-xs">{formatNumber(post.comments)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white">
                  <Share size={24} />
                  <span className="text-xs">{formatNumber(post.shares)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white">
                  <MoreVertical size={24} />
                </Button>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-20 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">@{post.user.toLowerCase().replace(' ', '')}</span>
                <span className="text-gray-400 text-sm">{post.timestamp}</span>
              </div>
              <p className="text-sm mb-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedView;
