
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X, ArrowLeft } from 'lucide-react';
import ProfileMediaGrid from '@/components/ProfileMediaGrid';
import ProfileFeedView from '@/components/ProfileFeedView';
import Sidebar from '@/components/Sidebar';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showFeedView, setShowFeedView] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
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
      type: 'video' as const,
      description: 'Meu primeiro vídeo no app! 🚀',
      likes: 89,
      comments: 12,
      shares: 5,
      isLiked: true,
      timestamp: 'há 2 dias'
    },
    {
      id: '2',
      type: 'carousel' as const,
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
      type: 'video' as const,
      description: 'Código funcionando perfeitamente! 💻',
      likes: 203,
      comments: 18,
      shares: 12,
      isLiked: true,
      timestamp: 'há 2 semanas'
    },
    {
      id: '4',
      type: 'carousel' as const,
      description: 'Momentos especiais 💫',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=711&fit=crop'
      ],
      likes: 342,
      comments: 67,
      shares: 23,
      isLiked: true,
      timestamp: 'há 3 semanas'
    },
    {
      id: '5',
      type: 'video' as const,
      description: 'Novo projeto em desenvolvimento! ⚡',
      likes: 445,
      comments: 89,
      shares: 34,
      isLiked: false,
      timestamp: 'há 1 mês'
    },
    {
      id: '6',
      type: 'carousel' as const,
      description: 'Arte e criatividade 🎨',
      images: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=711&fit=crop',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=711&fit=crop'
      ],
      likes: 567,
      comments: 123,
      shares: 45,
      isLiked: true,
      timestamp: 'há 1 mês'
    }
  ];

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

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
    setShowFeedView(true);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (showFeedView) {
    return (
      <ProfileFeedView
        media={userContent}
        initialIndex={selectedMediaIndex}
        userName={profile.name}
        onClose={() => setShowFeedView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <Sidebar activeTab="profile" onTabChange={() => {}} />
      
      <div className="flex-1 ml-20">
        {/* Header com botão voltar */}
        <div className="fixed top-0 left-20 right-0 bg-white z-50 p-4 border-b">
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

          {/* Grade de Mídias */}
          <ProfileMediaGrid 
            media={userContent} 
            onMediaClick={handleMediaClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
