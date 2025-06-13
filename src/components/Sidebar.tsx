
import { useState, useEffect } from 'react';
import { MessageCircle, Play, Video, Gamepad2, LogOut, Moon, Sun } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true); // Modo escuro como padrão

  // Set dark mode as default on first load
  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Conversas' },
    { id: 'feed', icon: Play, label: 'Feed' },
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
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        sidebarBg: 'bg-gray-900/50',
        mobileBg: 'bg-gray-900/50',
        textPrimary: 'text-white',
        textSecondary: 'text-gray-300',
        iconActive: 'bg-blue-600 text-white',
        iconInactive: 'text-gray-300 hover:bg-gray-700',
        profileBg: 'bg-blue-600',
        logoutHover: 'hover:bg-red-900',
        appBg: 'bg-gray-900'
      };
    } else {
      return {
        sidebarBg: 'bg-white/50',
        mobileBg: 'bg-white/50',
        textPrimary: 'text-gray-800',
        textSecondary: 'text-gray-600',
        iconActive: 'bg-chathy-primary text-white',
        iconInactive: 'text-chathy-primary hover:bg-chathy-primary/10',
        profileBg: 'bg-chathy-primary',
        logoutHover: 'hover:bg-red-50',
        appBg: 'bg-gray-100'
      };
    }
  };

  const theme = getThemeColors();

  // Apply background color to body
  document.body.className = `${theme.appBg} transition-colors duration-300`;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-16 ${theme.sidebarBg} backdrop-blur-md shadow-2xl rounded-2xl flex-col items-center py-4 space-y-4 transition-all duration-300`}>
        <div className="flex flex-col items-center space-y-3">
          <img 
            src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
            alt="Chathy Logo" 
            className="w-10 h-10"
          />
          
          <button
            onClick={handleProfileClick}
            className={`w-10 h-10 ${theme.profileBg} rounded-full flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-all duration-300`}
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
                  ? theme.iconActive + " shadow-lg"
                  : theme.iconInactive
              )}
            >
              <item.icon size={20} />
            </button>
          ))}
          
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${theme.iconInactive}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="w-8 mx-auto mt-4 pt-4">
            <button
              onClick={handleLogout}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 text-red-500 ${theme.logoutHover}`}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 ${theme.mobileBg} backdrop-blur-md shadow-sm h-16 transition-all duration-300`}>
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
              alt="Chathy Logo" 
              className="w-8 h-8"
            />
            <span className={`text-lg font-semibold ${theme.textPrimary}`}>Chathy</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  activeTab === item.id
                    ? theme.iconActive
                    : theme.iconInactive
                )}
              >
                <item.icon size={20} />
              </button>
            ))}
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${theme.iconInactive}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={handleProfileClick}
              className={`w-8 h-8 ${theme.profileBg} rounded-full flex items-center justify-center text-white font-bold text-sm ml-2`}
            >
              C
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
