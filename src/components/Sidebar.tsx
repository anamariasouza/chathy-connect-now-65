
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

      {/* Mobile Top Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between py-3 px-4">
          {/* Logo and Profile */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png" 
              alt="Chathy Logo" 
              className="w-8 h-8"
            />
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-sm"
            >
              C
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex items-center space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  activeTab === item.id
                    ? "text-chathy-primary bg-chathy-primary/10"
                    : "text-gray-600"
                )}
              >
                <item.icon size={20} />
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
