
import { useState } from 'react';
import { MessageCircle, Home, Video, Gamepad2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Conversas' },
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'lives', icon: Video, label: 'Lives' },
    { id: 'games', icon: Gamepad2, label: 'Jogos' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleMenuClick = (itemId: string) => {
    navigate('/');
    onTabChange(itemId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-16 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl flex-col items-center py-4 space-y-4 border border-gray-200">
        <div className="flex flex-col items-center space-y-3">
          <img 
            src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
            alt="Chathy Logo" 
            className="w-10 h-10"
          />
          
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-all duration-300"
          >
            C
          </button>
        </div>
        
        <div className="flex flex-col space-y-3 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110",
                activeTab === item.id
                  ? "bg-chathy-primary text-white shadow-lg"
                  : "text-chathy-primary hover:bg-chathy-primary/10"
              )}
            >
              <item.icon size={20} />
            </button>
          ))}
          
          <div className="border-t border-gray-200 w-8 mx-auto mt-4 pt-4">
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 text-red-500 hover:bg-red-50"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Minimized Mobile Sidebar */}
        <div className="fixed left-2 top-4 z-50 w-14 h-32 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col items-center py-3 border border-gray-200">
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 flex items-center justify-center"
          >
            <img 
              src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
              alt="Chathy Logo" 
              className="w-8 h-8"
            />
          </button>
          
          <button
            onClick={handleProfileClick}
            className="w-8 h-8 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-sm mt-2"
          >
            C
          </button>
        </div>

        {/* Expanded Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-40"
              onClick={toggleMobileMenu}
            />
            
            {/* Expanded Menu */}
            <div className="fixed left-2 top-4 z-50 w-48 bg-white/50 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={toggleMobileMenu}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <img 
                    src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
                    alt="Chathy Logo" 
                    className="w-8 h-8"
                  />
                </button>
                <span className="text-lg font-semibold text-gray-800">Chathy</span>
              </div>
              
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                      activeTab === item.id
                        ? "bg-chathy-primary text-white"
                        : "text-gray-700 hover:bg-white/70"
                    )}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-gray-300 my-3 pt-3">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:bg-white/70"
                  >
                    <div className="w-5 h-5 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                      C
                    </div>
                    <span className="text-sm font-medium">Perfil</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50/70 mt-1"
                  >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
