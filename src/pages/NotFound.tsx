
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, LogIn } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f5] to-[#e3f2fd] p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Mascote Image */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/2063ea8d-c7f2-4ae4-a21f-d5955bc1f9b3.png" 
            alt="Mascote Chathy - Erro" 
            className="w-64 h-64 object-contain drop-shadow-lg"
          />
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-4xl font-bold mb-4 text-[#111b21]">Oops!</h1>
          <h2 className="text-xl font-semibold mb-4 text-[#667781]">
            Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            A página que você está procurando não foi encontrada ou ocorreu um erro no servidor. 
            Não se preocupe, nosso mascote está aqui para te ajudar!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-[#00a884] hover:bg-[#008069] text-white font-medium py-3"
            >
              <RefreshCw size={18} className="mr-2" />
              Recarregar Página
            </Button>
            
            <Button 
              onClick={handleGoLogin}
              variant="outline"
              className="w-full border-[#00a884] text-[#00a884] hover:bg-[#00a884] hover:text-white font-medium py-3"
            >
              <LogIn size={18} className="mr-2" />
              Ir para Login
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="ghost"
              className="w-full text-[#667781] hover:text-[#111b21] hover:bg-gray-50 font-medium py-3"
            >
              <Home size={18} className="mr-2" />
              Página Inicial
            </Button>
          </div>

          {/* Error Code Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Código do erro: {location.pathname ? '404 - Página não encontrada' : 'Erro de servidor'}
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Se o problema persistir, tente recarregar a página ou entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
