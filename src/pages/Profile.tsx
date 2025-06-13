import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X, ArrowLeft, Camera } from 'lucide-react';
import ProfileMediaGrid from '@/components/ProfileMediaGrid';
import ProfileFeedView from '@/components/ProfileFeedView';
import Sidebar from '@/components/Sidebar';
import { ContactProfile } from '@/data/contactProfiles';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showFeedView, setShowFeedView] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Perfil padrão do usuário
  const defaultProfile = {
    name: 'Walter Silva',
    email: 'walter2161@gmail.com',
    phone: '+55 11 99999-9999',
    location: 'São Paulo, SP',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação.',
    joinDate: '2024',
    followers: 1250,
    following: 345,
    posts: 12
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [editProfile, setEditProfile] = useState(defaultProfile);
  const { toast } = useToast();

  // Verificar se é um perfil de contato externo
  useEffect(() => {
    const contactData = location.state?.contact as ContactProfile;
    if (contactData) {
      setProfile(contactData);
      setEditProfile(contactData);
      setIsOwnProfile(false);
      setIsEditing(false);
    } else {
      setIsOwnProfile(true);
      // Carregar dados salvos do próprio usuário
      const savedProfile = localStorage.getItem('userProfile');
      const savedProfileImage = localStorage.getItem('userProfileImage');
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setEditProfile(parsedProfile);
      }
      
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
    }
  }, [location.state]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Set initial theme
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

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

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        mainBg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        textPrimary: 'text-white',
        textSecondary: 'text-gray-300',
        borderColor: 'border-gray-700'
      };
    } else {
      return {
        mainBg: 'bg-gray-50',
        cardBg: 'bg-white',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        borderColor: 'border-gray-200'
      };
    }
  };

  const theme = getThemeColors();

  const handleSave = () => {
    if (isOwnProfile) {
      setProfile(editProfile);
      localStorage.setItem('userProfile', JSON.stringify(editProfile));
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isOwnProfile) {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setProfileImage(imageUrl);
          localStorage.setItem('userProfileImage', imageUrl);
          toast({
            title: "Foto atualizada!",
            description: "Sua foto de perfil foi alterada com sucesso.",
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProfileImageClick = () => {
    if (isEditing && isOwnProfile) {
      fileInputRef.current?.click();
    }
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
    <div className={`min-h-screen flex ${theme.mainBg} relative transition-colors duration-300`}>
      <Sidebar activeTab="profile" onTabChange={() => {}} />
      
      <div className="flex-1 md:ml-20 pt-20 md:pt-0">
        {/* Header com botão voltar */}
        <div className={`fixed top-20 md:top-0 left-0 md:left-20 right-0 ${theme.cardBg} z-50 p-4 ${theme.borderColor} border-b transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className={`text-xl font-bold ${theme.textPrimary}`}>{profile.name}</h1>
          </div>
        </div>

        <div className="pt-20 pb-4">
          {/* Header do Perfil */}
          <Card className={`mx-4 mb-4 ${theme.cardBg} ${theme.borderColor} border transition-colors duration-300`}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div 
                    className="w-20 h-20 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden cursor-pointer"
                    onClick={handleProfileImageClick}
                  >
                    {(profileImage && isOwnProfile) ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.name.charAt(0)
                    )}
                  </div>
                  {isEditing && isOwnProfile && (
                    <div className="absolute -bottom-1 -right-1 bg-chathy-primary rounded-full p-1.5">
                      <Camera size={14} className="text-white" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className={`text-lg font-bold ${theme.textPrimary}`}>{profile.name}</h2>
                    {!isEditing && isOwnProfile ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit2 size={16} className="mr-2" />
                        Editar
                      </Button>
                    ) : isEditing && isOwnProfile ? (
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
                    ) : null}
                  </div>
                  
                  {/* Estatísticas */}
                  <div className="flex gap-6 mb-2">
                    <div className="text-center">
                      <div className={`font-bold ${theme.textPrimary}`}>{profile.posts}</div>
                      <div className={`${theme.textSecondary} text-xs`}>Posts</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${theme.textPrimary}`}>{formatNumber(profile.followers)}</div>
                      <div className={`${theme.textSecondary} text-xs`}>Seguidores</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${theme.textPrimary}`}>{profile.following}</div>
                      <div className={`${theme.textSecondary} text-xs`}>Seguindo</div>
                    </div>
                  </div>

                  <p className={`${theme.textSecondary} text-sm`}>{profile.bio}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Formulário de Edição - apenas para o próprio perfil */}
          {isEditing && isOwnProfile && (
            <Card className={`mx-4 mb-4 ${theme.cardBg} ${theme.borderColor} border transition-colors duration-300`}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={theme.textPrimary}>Nome</Label>
                      <Input
                        id="name"
                        value={editProfile.name}
                        onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                        className={`${theme.cardBg} ${theme.borderColor} border ${theme.textPrimary}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={theme.textPrimary}>Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editProfile.email}
                        onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                        className={`${theme.cardBg} ${theme.borderColor} border ${theme.textPrimary}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className={theme.textPrimary}>Biografia</Label>
                    <Input
                      id="bio"
                      value={editProfile.bio}
                      onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                      className={`${theme.cardBg} ${theme.borderColor} border ${theme.textPrimary}`}
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
