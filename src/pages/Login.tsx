
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
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
          checkAuth();
        }
      } else {
        // Passou das 24h, limpar dados
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
      }
    }
  }, [isAuthenticated, checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar se o usuário não digitou @gmail.com no campo
      if (emailPrefix.includes('@')) {
        toast({
          title: "Erro no email",
          description: "Digite apenas o nome do email, sem @gmail.com",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Validar se os campos não estão vazios
      if (!emailPrefix.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "Digite seu endereço de email",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!password.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "Digite sua senha",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 1000));

      const fullEmail = emailPrefix.trim() + '@gmail.com';
      
      if (fullEmail === 'walter2161@gmail.com' && password === '976431') {
        const currentTime = new Date().getTime();
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', fullEmail);
        localStorage.setItem('loginTime', currentTime.toString());
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        
        // Usar checkAuth ao invés de reload forçado
        checkAuth();
        navigate('/', { replace: true });
      } else {
        // Mostrar erro específico baseado no que está errado
        if (fullEmail !== 'walter2161@gmail.com' && password !== '976431') {
          toast({
            title: "Credenciais inválidas",
            description: "Email e senha estão incorretos",
            variant: "destructive",
          });
        } else if (fullEmail !== 'walter2161@gmail.com') {
          toast({
            title: "Email incorreto",
            description: "O endereço de email não existe",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Senha incorreta",
            description: "A senha digitada está incorreta",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remover @gmail.com se o usuário tentar digitar
    if (value.includes('@gmail.com')) {
      value = value.replace('@gmail.com', '');
    }
    // Remover apenas @ também
    if (value.includes('@')) {
      value = value.replace('@', '');
    }
    setEmailPrefix(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center mb-4">
            <img 
              src="/lovable-uploads/c3048bc0-d027-4174-b4d7-175e6286480e.png" 
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
              <div className="relative">
                <Input
                  id="email"
                  type="text"
                  placeholder="seuemail"
                  value={emailPrefix}
                  onChange={handleEmailChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
