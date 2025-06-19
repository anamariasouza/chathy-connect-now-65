import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Login = () => {
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modais
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  // Estados para registro
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const [isRegisterCodeSent, setIsRegisterCodeSent] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  
  // Estados para recuperação de senha
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isForgotCodeSent, setIsForgotCodeSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  
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

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const simulateEmailSend = async (email: string, code: string, type: 'register' | 'forgot') => {
    // Simula envio de email - na implementação real, aqui seria uma chamada para API
    console.log(`Enviando código ${code} para ${email} (${type})`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  };

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
      
      // Verifica se o usuário está registrado
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const userExists = registeredUsers[fullEmail];
      
      if (!userExists) {
        toast({
          title: "Usuário não encontrado",
          description: "Este email não está cadastrado. Registre-se primeiro.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
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
      } else if (userExists.password === password) {
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
        toast({
          title: "Senha incorreta",
          description: "A senha digitada está incorreta",
          variant: "destructive",
        });
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

  const handleRegisterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.includes('@gmail.com')) {
      value = value.replace('@gmail.com', '');
    }
    if (value.includes('@')) {
      value = value.replace('@', '');
    }
    setRegisterEmail(value);
  };

  const handleForgotEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.includes('@gmail.com')) {
      value = value.replace('@gmail.com', '');
    }
    if (value.includes('@')) {
      value = value.replace('@', '');
    }
    setForgotEmail(value);
  };

  const handleSendRegisterCode = async () => {
    if (!registerEmail.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite seu email",
        variant: "destructive",
      });
      return;
    }

    if (!registerPassword.trim() || registerPassword.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Confirme a senha corretamente",
        variant: "destructive",
      });
      return;
    }

    setIsRegisterLoading(true);

    try {
      const fullEmail = registerEmail.trim() + '@gmail.com';
      
      // Verifica se já existe um usuário com este email
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registeredUsers[fullEmail]) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já possui uma conta",
          variant: "destructive",
        });
        setIsRegisterLoading(false);
        return;
      }

      const code = generateVerificationCode();
      await simulateEmailSend(fullEmail, code, 'register');
      
      // Armazena o código temporariamente
      localStorage.setItem('tempRegisterCode', code);
      localStorage.setItem('tempRegisterEmail', fullEmail);
      localStorage.setItem('tempRegisterPassword', registerPassword);
      
      setIsRegisterCodeSent(true);
      
      toast({
        title: "Código enviado!",
        description: `Verifique seu email ${fullEmail}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar código",
        description: "Tente novamente",
        variant: "destructive",
      });
    }

    setIsRegisterLoading(false);
  };

  const handleVerifyRegisterCode = async () => {
    const savedCode = localStorage.getItem('tempRegisterCode');
    const savedEmail = localStorage.getItem('tempRegisterEmail');
    const savedPassword = localStorage.getItem('tempRegisterPassword');

    if (registerCode !== savedCode) {
      toast({
        title: "Código inválido",
        description: "Digite o código correto",
        variant: "destructive",
      });
      return;
    }

    if (savedEmail && savedPassword) {
      // Registra o usuário
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      registeredUsers[savedEmail] = { password: savedPassword };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Limpa dados temporários
      localStorage.removeItem('tempRegisterCode');
      localStorage.removeItem('tempRegisterEmail');
      localStorage.removeItem('tempRegisterPassword');
      
      toast({
        title: "Cadastro realizado!",
        description: "Agora você pode fazer login",
      });
      
      setShowRegisterModal(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setRegisterCode('');
      setIsRegisterCodeSent(false);
    }
  };

  const handleSendForgotCode = async () => {
    if (!forgotEmail.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite seu email",
        variant: "destructive",
      });
      return;
    }

    setIsForgotLoading(true);

    try {
      const fullEmail = forgotEmail.trim() + '@gmail.com';
      
      // Verifica se o usuário existe
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (!registeredUsers[fullEmail] && fullEmail !== 'walter2161@gmail.com') {
        toast({
          title: "Email não encontrado",
          description: "Este email não está cadastrado",
          variant: "destructive",
        });
        setIsForgotLoading(false);
        return;
      }

      const code = generateVerificationCode();
      await simulateEmailSend(fullEmail, code, 'forgot');
      
      localStorage.setItem('tempForgotCode', code);
      localStorage.setItem('tempForgotEmail', fullEmail);
      
      setIsForgotCodeSent(true);
      
      toast({
        title: "Código enviado!",
        description: `Verifique seu email ${fullEmail}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar código",
        description: "Tente novamente",
        variant: "destructive",
      });
    }

    setIsForgotLoading(false);
  };

  const handleResetPassword = async () => {
    const savedCode = localStorage.getItem('tempForgotCode');
    const savedEmail = localStorage.getItem('tempForgotEmail');

    if (forgotCode !== savedCode) {
      toast({
        title: "Código inválido",
        description: "Digite o código correto",
        variant: "destructive",
      });
      return;
    }

    if (!newPassword.trim() || newPassword.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Confirme a nova senha corretamente",
        variant: "destructive",
      });
      return;
    }

    if (savedEmail) {
      // Atualiza a senha
      if (savedEmail === 'walter2161@gmail.com') {
        // Para o usuário padrão, não atualizamos (apenas simulamos)
        toast({
          title: "Senha alterada!",
          description: "Sua nova senha foi definida",
        });
      } else {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        if (registeredUsers[savedEmail]) {
          registeredUsers[savedEmail].password = newPassword;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        toast({
          title: "Senha alterada!",
          description: "Sua nova senha foi definida",
        });
      }
      
      // Limpa dados temporários
      localStorage.removeItem('tempForgotCode');
      localStorage.removeItem('tempForgotEmail');
      
      setShowForgotPasswordModal(false);
      setForgotEmail('');
      setForgotCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsForgotCodeSent(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
      <div className="w-full max-w-md">
        {/* WhatsApp Web style header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/6278072d-3af7-4137-a3ab-0b4239621600.png" 
              alt="Chathy Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        <Card className="bg-white border-[#e9edef] shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-[#111b21] font-medium">Entrar na conta</CardTitle>
            <CardDescription className="text-center text-[#667781] text-sm font-medium">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#111b21] text-sm font-medium">Email</Label>
                <p className="text-xs text-[#667781] mb-2 font-medium">
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
                    className="flex-1 border-0 bg-transparent text-[#111b21] placeholder-[#8696a0] focus:ring-0 focus:border-0 rounded-none font-medium"
                  />
                  <div className="flex items-center px-3 bg-[#f0f2f5] text-[#667781] text-sm font-medium">
                    @gmail.com
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#111b21] text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] pr-10 focus:border-[#00a884] font-medium"
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
                  className="text-sm text-[#667781] cursor-pointer font-medium"
                >
                  Lembrar de mim
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#00a884] hover:bg-[#008069] text-white font-medium py-2.5 mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Links para registro e recuperação de senha */}
            <div className="mt-6 space-y-3 text-center">
              <button
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm text-[#00a884] hover:text-[#008069] font-medium"
              >
                Esqueci a senha
              </button>
              <div className="text-sm text-[#667781]">
                Não tem uma conta?{' '}
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="text-[#00a884] hover:text-[#008069] font-medium"
                >
                  Cadastre-se
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer text similar to WhatsApp Web */}
        <div className="text-center mt-8 text-xs text-[#8696a0] space-y-2">
          <p className="font-medium">Suas mensagens pessoais são protegidas pela criptografia de ponta a ponta</p>
        </div>
      </div>

      {/* Modal de Registro */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#111b21]">Criar nova conta</DialogTitle>
            <DialogDescription className="text-[#667781]">
              {!isRegisterCodeSent 
                ? "Preencha os dados para criar sua conta"
                : "Digite o código enviado para seu email"
              }
            </DialogDescription>
          </DialogHeader>
          
          {!isRegisterCodeSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-[#111b21] text-sm font-medium">Email</Label>
                <div className="flex rounded-md border border-[#e9edef] bg-white overflow-hidden focus-within:border-[#00a884]">
                  <Input
                    id="register-email"
                    type="text"
                    placeholder="seuemail"
                    value={registerEmail}
                    onChange={handleRegisterEmailChange}
                    className="flex-1 border-0 bg-transparent text-[#111b21] placeholder-[#8696a0] focus:ring-0 focus:border-0 rounded-none"
                  />
                  <div className="flex items-center px-3 bg-[#f0f2f5] text-[#667781] text-sm">
                    @gmail.com
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-[#111b21] text-sm font-medium">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] focus:border-[#00a884]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[#111b21] text-sm font-medium">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] focus:border-[#00a884]"
                />
              </div>
              
              <Button 
                onClick={handleSendRegisterCode}
                className="w-full bg-[#00a884] hover:bg-[#008069] text-white"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? 'Enviando código...' : 'Enviar código de verificação'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-code" className="text-[#111b21] text-sm font-medium">Código de Verificação</Label>
                <Input
                  id="register-code"
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  value={registerCode}
                  onChange={(e) => setRegisterCode(e.target.value)}
                  className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] focus:border-[#00a884]"
                  maxLength={6}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsRegisterCodeSent(false)}
                  className="flex-1"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleVerifyRegisterCode}
                  className="flex-1 bg-[#00a884] hover:bg-[#008069] text-white"
                >
                  Verificar código
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Recuperação de Senha */}
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#111b21]">Recuperar senha</DialogTitle>
            <DialogDescription className="text-[#667781]">
              {!isForgotCodeSent 
                ? "Digite seu email para receber o código de recuperação"
                : "Digite o código e sua nova senha"
              }
            </DialogDescription>
          </DialogHeader>
          
          {!isForgotCodeSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-[#111b21] text-sm font-medium">Email</Label>
                <div className="flex rounded-md border border-[#e9edef] bg-white overflow-hidden focus-within:border-[#00a884]">
                  <Input
                    id="forgot-email"
                    type="text"
                    placeholder="seuemail"
                    value={forgotEmail}
                    onChange={handleForgotEmailChange}
                    className="flex-1 border-0 bg-transparent text-[#111b21] placeholder-[#8696a0] focus:ring-0 focus:border-0 rounded-none"
                  />
                  <div className="flex items-center px-3 bg-[#f0f2f5] text-[#667781] text-sm">
                    @gmail.com
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSendForgotCode}
                className="w-full bg-[#00a884] hover:bg-[#008069] text-white"
                disabled={isForgotLoading}
              >
                {isForgotLoading ? 'Enviando código...' : 'Enviar código de recuperação'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-code" className="text-[#111b21] text-sm font-medium">Código de Verificação</Label>
                <Input
                  id="forgot-code"
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value)}
                  className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] focus:border-[#00a884]"
                  maxLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[#111b21] text-sm font-medium">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] focus:border-[#00a884]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-[#111b21] text-sm font-medium">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Digite a nova senha novamente"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-white border-[#e9edef] text-[#111b21] placeholder-[#8696a0] focus:border-[#00a884]"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsForgotCodeSent(false)}
                  className="flex-1"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleResetPassword}
                  className="flex-1 bg-[#00a884] hover:bg-[#008069] text-white"
                >
                  Alterar senha
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
