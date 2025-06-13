
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X, ArrowLeft, Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Walter Silva',
    email: 'walter2161@gmail.com',
    phone: '+55 11 99999-9999',
    location: 'São Paulo, SP',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação.',
    joinDate: '2024',
    followers: 1250,
    following: 345,
    posts: 12
  });
  const [editProfile, setEditProfile] = useState(profile);
  const { toast } = useToast();

  // Conteúdo do usuário com vídeos e carrossel
  const userContent = [
    {
      id: '1',
      type: 'video',
      description: 'Meu primeiro vídeo no app! 🚀',
      likes: 89,
      comments: 12,
      shares: 5,
      isLiked: true,
      timestamp: 'há 2 dias'
    },
    {
      id: '2',
      type: 'carousel',
      description: 'Viagem incrível! 📸✨',
      images: [
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=711&fit=crop'
      ],
      likes: 156,
      comments: 24,
      shares: 8,
      isLiked: false,
      timestamp: 'há 1 semana'
    },
    {
      id: '3',
      type: 'video',
      description: 'Código funcionando perfeitamente! 💻',
      likes: 203,
      comments: 18,
      shares: 12,
      isLiked: true,
      timestamp: 'há 2 semanas'
    }
  ];

  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [carouselApis, setCarouselApis] = useState<Map<string, CarouselApi>>(new Map());
  const [currentSlides, setCurrentSlides] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setEditProfile(parsedProfile);
    }
  }, []);

  const handleSave = () => {
    setProfile(editProfile);
    localStorage.setItem('userProfile', JSON.stringify(editProfile));
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

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
    <div className="min-h-screen bg-gray-100">
      {/* Header com botão voltar */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 p-4 border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">{profile.name}</h1>
        </div>
      </div>

      <div className="pt-20 pb-4">
        {/* Header do Perfil */}
        <Card className="mx-4 mb-4">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-lg font-bold">{profile.name}</h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit2 size={16} className="mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button onClick={handleSave} size="sm" className="bg-chathy-primary hover:bg-chathy-primary/90">
                        <Save size={16} className="mr-2" />
                        Salvar
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X size={16} className="mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Estatísticas */}
                <div className="flex gap-6 mb-2">
                  <div className="text-center">
                    <div className="font-bold">{profile.posts}</div>
                    <div className="text-gray-600 text-xs">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{formatNumber(profile.followers)}</div>
                    <div className="text-gray-600 text-xs">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{profile.following}</div>
                    <div className="text-gray-600 text-xs">Seguindo</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">{profile.bio}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Formulário de Edição */}
        {isEditing && (
          <Card className="mx-4 mb-4">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Input
                    id="bio"
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feed de Conteúdo do Usuário */}
        <div className="space-y-4 px-4">
          {userContent.map((content) => (
            <Card key={content.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Conteúdo de Mídia */}
                <div className="relative bg-black aspect-[9/16] max-h-[60vh] flex items-center justify-center">
                  {content.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <div className="w-full h-full bg-gradient-to-br from-chathy-primary to-chathy-secondary flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Play size={24} />
                          </div>
                          <p className="text-sm opacity-75">Vídeo de {profile.name}</p>
                        </div>
                      </div>
                      
                      {/* Controles de Vídeo */}
                      <div className="absolute bottom-4 left-4 flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlay(content.id)}
                          className="bg-black/50 text-white hover:bg-black/70 rounded-full w-8 h-8 p-0"
                        >
                          {playingVideos.has(content.id) ? <Pause size={14} /> : <Play size={14} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMute(content.id)}
                          className="bg-black/50 text-white hover:bg-black/70 rounded-full w-8 h-8 p-0"
                        >
                          {mutedVideos.has(content.id) ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </Button>
                      </div>
                    </div>
                  ) : content.images ? (
                    <div className="w-full h-full relative">
                      <Carousel 
                        className="w-full h-full"
                        setApi={(api) => setCarouselApi(content.id, api)}
                      >
                        <CarouselContent className="h-full -ml-0">
                          {content.images.map((image, imageIndex) => (
                            <CarouselItem key={imageIndex} className="h-full pl-0 basis-full">
                              <div className="w-full h-full relative">
                                <img 
                                  src={image} 
                                  alt={`Imagem ${imageIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                      
                      {/* Indicadores de carrossel */}
                      {content.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {content.images.map((_, dotIndex) => (
                            <div
                              key={dotIndex}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                (currentSlides.get(content.id) || 0) === dotIndex
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Ações no lado direito */}
                  <div className="absolute right-4 bottom-16 flex flex-col space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex flex-col items-center space-y-1 ${
                        content.isLiked ? 'text-red-500' : 'text-white'
                      }`}
                    >
                      <Heart size={24} fill={content.isLiked ? 'currentColor' : 'none'} />
                      <span className="text-xs font-semibold">{formatNumber(content.likes)}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white">
                      <MessageCircle size={24} />
                      <span className="text-xs font-semibold">{formatNumber(content.comments)}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-white">
                      <Share size={24} />
                      <span className="text-xs font-semibold">{formatNumber(content.shares)}</span>
                    </Button>
                  </div>
                </div>

                {/* Informações do Post */}
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{profile.name}</span>
                    <span className="text-gray-500 text-sm">{content.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{content.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
