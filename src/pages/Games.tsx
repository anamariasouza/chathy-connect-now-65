
import { useState } from 'react';
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 md:ml-20 ml-0">
          <div className="h-screen flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between ml-16 md:ml-0">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToGames}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Voltar aos Jogos</span>
                </Button>
                <h1 className="text-lg md:text-xl font-semibold">{selectedGame.title}</h1>
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
            <div className="flex-1 ml-16 md:ml-0">
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
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 md:ml-20 ml-0 p-6 pl-20 md:pl-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Jogos</h1>
              <p className="text-gray-600">Divirta-se com nossos jogos integrados!</p>
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
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleGameSelect(game)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {game.title}
                    <ExternalLink size={16} className="text-gray-400" />
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
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
