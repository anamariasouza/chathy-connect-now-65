import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  useEffect(() => {
    const savedEmailPrefix = localStorage.getItem('rememberedEmailPrefix');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedRememberMe && savedEmailPrefix && savedPassword) {
      setEmailPrefix(savedEmailPrefix);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const currentTime = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (currentTime - parseInt(loginTime) < twentyFourHours) {
        if (!isAuthenticated) {
          localStorage.setItem('isAuthenticated', 'true');
          checkAuth();
        }
      } else {
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
      if (emailPrefix.includes('@')) {
        toast({
          title: "Erro no email",
          description: "Digite apenas o nome do email, sem @gmail.com",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

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

      await new Promise(resolve => setTimeout(resolve, 1000));

      const fullEmail = emailPrefix.trim() + '@gmail.com';
      
      if (fullEmail === 'walter2161@gmail.com' && password === '976431') {
        const currentTime = new Date().getTime();
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', fullEmail);
        localStorage.setItem('loginTime', currentTime.toString());
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmailPrefix', emailPrefix.trim());
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmailPrefix');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        
        checkAuth();
        navigate('/', { replace: true });
      } else {
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
    if (value.includes('@gmail.com')) {
      value = value.replace('@gmail.com', '');
    }
    if (value.includes('@')) {
      value = value.replace('@', '');
    }
    setEmailPrefix(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
      <div className="w-full max-w-md">
        {/* WhatsApp Web style header */}
        <div className="text-center mb-8">
          <div className="whatsapp-header-gradient w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/97e49b2b-0caf-467d-a8af-39923c0a7a77.png" 
              alt="Chathy Logo" 
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-2xl font-light text-[#111b21] mb-2">Chathy Web</h1>
          <p className="text-[#667781] text-sm">
            Para usar o Chathy no seu computador:
          </p>
          <div className="text-[#667781] text-xs mt-2 space-y-1">
            <p>1. Digite suas credenciais abaixo</p>
            <p>2. Mantenha seu telefone conectado à internet</p>
          </div>
        </div>

        <Card className="bg-white border-[#e9edef] shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-[#111b21] font-normal">Entrar na conta</CardTitle>
            <CardDescription className="text-center text-[#667781] text-sm">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#111b21] text-sm font-normal">Email</Label>
                <p className="text-xs text-[#667781] mb-2">
                  Digite apenas a primeira parte do seu email
                </p>
                <div className="flex rounded-md border border-[#e9edef] bg-white overflow-hidden focus-within:border-[#00a884]">
                  <Input
                    id="email"
                    type="text"
                    placeholder="seuemail"
                    value={emailPrefix}
                    onChange={handleEmailChange}
                    required
                    className="flex-1 border-0 bg-transparent text-[#111b21] placeholder-[#8696a0] focus:ring-0 focus:border-0 rounded-none"
                  />
                  <div className="flex items-center px-3 bg-[#f0f2f5] text-[#667781] text-sm">
                    @gmail.com
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#111b21] text-sm font-normal">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] pr-10 focus:border-[#00a884]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8696a0] hover:text-[#111b21]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-[#e9edef] data-[state=checked]:bg-[#00a884] data-[state=checked]:border-[#00a884]"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-[#667781] cursor-pointer font-normal"
                >
                  Lembrar de mim
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#00a884] hover:bg-[#008069] text-white font-normal py-2.5 mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer text similar to WhatsApp Web */}
        <div className="text-center mt-8 text-xs text-[#8696a0] space-y-2">
          <p>Suas mensagens pessoais são protegidas pela criptografia de ponta a ponta</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
