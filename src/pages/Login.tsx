
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Verificar se ainda está dentro das 24h de login
  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const currentTime = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24h em millisegundos
      
      if (currentTime - parseInt(loginTime) < twentyFourHours) {
        // Ainda dentro das 24h, manter logado
        if (!isAuthenticated) {
          localStorage.setItem('isAuthenticated', 'true');
          window.location.reload();
        }
      } else {
        // Passou das 24h, limpar dados
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
      }
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de login
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'walter2161@gmail.com' && password === '976431') {
      const currentTime = new Date().getTime();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('loginTime', currentTime.toString());
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      
      // Força um reload do estado de autenticação
      window.location.reload();
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center mb-4">
            <img 
              src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
              alt="Chathy Logo" 
              className="w-32 h-auto mb-2"
            />
          </div>
          <CardTitle className="text-2xl text-center text-white">Entrar no Chathy</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Digite suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="walter2161@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button type="submit" className="w-full bg-chathy-primary hover:bg-chathy-primary/90" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
