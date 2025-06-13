
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Grid3X3, Heart, MessageCircle, Bookmark } from 'lucide-react';

const Profile = () => {
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
    posts: 89
  });
  const [editProfile, setEditProfile] = useState(profile);
  const { toast } = useToast();

  // Mock data para as mídias
  const mockPosts = [
    { id: 1, image: 'https://picsum.photos/300/300?random=1', likes: 124, comments: 8 },
    { id: 2, image: 'https://picsum.photos/300/300?random=2', likes: 89, comments: 12 },
    { id: 3, image: 'https://picsum.photos/300/300?random=3', likes: 156, comments: 5 },
    { id: 4, image: 'https://picsum.photos/300/300?random=4', likes: 203, comments: 18 },
    { id: 5, image: 'https://picsum.photos/300/300?random=5', likes: 92, comments: 7 },
    { id: 6, image: 'https://picsum.photos/300/300?random=6', likes: 167, comments: 14 },
    { id: 7, image: 'https://picsum.photos/300/300?random=7', likes: 134, comments: 9 },
    { id: 8, image: 'https://picsum.photos/300/300?random=8', likes: 78, comments: 6 },
    { id: 9, image: 'https://picsum.photos/300/300?random=9', likes: 245, comments: 22 }
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header do Perfil */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-4xl">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit2 size={16} className="mr-2" />
                      Editar Perfil
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
                <div className="flex justify-center md:justify-start gap-8">
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.posts}</div>
                    <div className="text-gray-600 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.followers}</div>
                    <div className="text-gray-600 text-sm">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.following}</div>
                    <div className="text-gray-600 text-sm">Seguindo</div>
                  </div>
                </div>

                <p className="text-gray-600 text-center md:text-left">{profile.bio}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Informações Editáveis */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editProfile.phone}
                    onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={editProfile.location}
                    onChange={(e) => setEditProfile({...editProfile, location: e.target.value})}
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
            </CardContent>
          </Card>
        )}

        {/* Seção de Mídias estilo Instagram */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <Grid3X3 size={20} className="text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {mockPosts.map((post) => (
                <div key={post.id} className="relative group aspect-square">
                  <img 
                    src={post.image} 
                    alt={`Post ${post.id}`}
                    className="w-full h-full object-cover rounded cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart size={16} fill="white" />
                        <span className="text-sm font-semibold">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} fill="white" />
                        <span className="text-sm font-semibold">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
