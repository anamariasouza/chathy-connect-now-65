
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

interface SimpleLoginProps {
  onLogin: (user: User) => void;
}

const SimpleLogin = ({ onLogin }: SimpleLoginProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: 'walter2161',
      username: 'walter2161',
      name: 'Walter',
      avatar: '/lovable-uploads/2694899a-ed7c-4d27-abc6-9722b9e5bf1c.png'
    },
    {
      id: 'michael',
      username: 'michael',
      name: 'Michael',
      avatar: '/lovable-uploads/b9c3df60-de8a-4271-907d-dfd93761ac3f.png'
    }
  ];

  const handleLogin = () => {
    if (selectedUser) {
      onLogin(selectedUser);
      localStorage.setItem('currentUser', JSON.stringify(selectedUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().getTime().toString());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chathy-primary to-chathy-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-chathy-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            C
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Bem-vindo ao Chathy
          </CardTitle>
          <p className="text-gray-600">Selecione seu usuário para entrar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                selectedUser?.id === user.id 
                  ? 'border-chathy-primary bg-blue-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-chathy-primary text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full bg-chathy-primary hover:bg-chathy-primary/90 text-white"
          >
            Entrar como {selectedUser?.name || 'usuário'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleLogin;
