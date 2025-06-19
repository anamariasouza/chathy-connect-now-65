
import { useState, useEffect } from 'react';
import { MessageCircle, Play, Video, Gamepad2, LogOut, Volume2, VolumeX, Menu, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  audioEnabled?: boolean;
  onAudioToggle?: () => void;
}

const Sidebar = ({ activeTab, onTabChange, audioEnabled = true, onAudioToggle }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Conversas' },
    { id: 'feed', icon: Play, label: 'Status' },
    { id: 'lives', icon: Video, label: 'Calls' },
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
      {/* Desktop Sidebar - WhatsApp Web Style */}
      <div className="hidden md:flex fixed left-0 top-0 z-50 w-16 h-full bg-[#202c33] flex-col items-center py-4 space-y-3">
        {/* Profile section */}
        <div className="flex flex-col items-center space-y-3 mb-4">
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
          >
            <img 
              src="/lovable-uploads/dd9738c9-e44d-4130-86fc-a762359e3a4e.png" 
              alt="Chathy Logo" 
              className="w-8 h-8 object-contain"
            />
          </button>
        </div>
        
        {/* Menu items */}
        <div className="flex flex-col space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative group",
                activeTab === item.id
                  ? "bg-[#2a3942] text-[#00a884]"
                  : "text-[#aebac1] hover:bg-[#2a3942] hover:text-white"
              )}
              title={item.label}
            >
              <item.icon size={20} />
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#00a884] rounded-r"></div>
              )}
            </button>
          ))}
          
          <button
            onClick={onAudioToggle}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
              audioEnabled 
                ? "bg-[#00a884] text-white"
                : "text-[#aebac1] hover:bg-[#2a3942] hover:text-white"
            )}
            title={audioEnabled ? "Desativar som" : "Ativar som"}
          >
            {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
        
        {/* Bottom actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 text-[#aebac1] hover:bg-[#2a3942] hover:text-red-400"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Header - WhatsApp Style */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#202c33] h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/dd9738c9-e44d-4130-86fc-a762359e3a4e.png" 
              alt="Chathy Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-normal text-white">Chathy</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-200",
                  activeTab === item.id
                    ? "bg-[#2a3942] text-[#00a884]"
                    : "text-[#aebac1] hover:bg-[#2a3942]"
                )}
              >
                <item.icon size={20} />
              </button>
            ))}
            
            <button
              onClick={onAudioToggle}
              className={cn(
                "p-2.5 rounded-full transition-all duration-200",
                audioEnabled 
                  ? "bg-[#00a884] text-white"
                  : "text-[#aebac1] hover:bg-[#2a3942]"
              )}
            >
              {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center ml-2 hover:bg-gray-100 transition-all duration-200"
            >
              <img 
                src="/lovable-uploads/dd9738c9-e44d-4130-86fc-a762359e3a4e.png" 
                alt="Chathy Logo" 
                className="w-6 h-6 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
