
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
}

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeTab, setActiveTab] = useState('games');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const games: Game[] = [
    {
      id: 'jogo-dos-bichos',
      title: 'Jogo dos Bichos',
      description: 'Teste sua sorte no tradicional jogo dos bichos!',
      url: 'https://jogodosbichoshyping.netlify.app'
    },
    {
      id: 'paciencia',
      title: 'Paciência',
      description: 'Relaxe jogando o clássico jogo de cartas Paciência.',
      url: 'https://paciencia.netlify.app/'
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

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  if (selectedGame) {
    return (
      <div className={`min-h-screen flex ${theme.mainBg} transition-colors duration-300`}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 md:ml-20">
          <div className="h-screen flex flex-col pt-20 md:pt-0">
            <div className={`${theme.cardBg} ${theme.borderColor} border-b p-4 flex items-center justify-between transition-colors duration-300`}>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToGames}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Voltar aos Jogos</span>
                </Button>
                <h1 className={`text-lg md:text-xl font-semibold ${theme.textPrimary}`}>{selectedGame.title}</h1>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.open(selectedGame.url, '_blank')}
                className="flex items-center space-x-2"
              >
                <ExternalLink size={16} />
                <span className="hidden sm:inline">Abrir em Nova Aba</span>
              </Button>
            </div>
            <div className="flex-1">
              <iframe
                src={selectedGame.url}
                className="w-full h-full border-0"
                title={selectedGame.title}
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${theme.mainBg} transition-colors duration-300`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 md:ml-20 pt-20 md:pt-0 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${theme.textPrimary} mb-2`}>Jogos</h1>
              <p className={theme.textSecondary}>Divirta-se com nossos jogos integrados!</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToMain}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Voltar ao Chat</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${theme.cardBg} ${theme.borderColor} border`}
                onClick={() => handleGameSelect(game)}
              >
                <CardHeader>
                  <CardTitle className={`flex items-center justify-between ${theme.textPrimary}`}>
                    {game.title}
                    <ExternalLink size={16} className={theme.textSecondary} />
                  </CardTitle>
                  <CardDescription className={theme.textSecondary}>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gradient-bg">
                    Jogar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
