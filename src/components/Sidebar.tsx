
import { useState } from 'react';
import { MessageCircle, Home, Video, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Conversas' },
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'lives', icon: Video, label: 'Lives' },
    { id: 'calls', icon: Phone, label: 'Chamadas' },
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-16 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col items-center py-4 space-y-4 border border-gray-200">
      <div className="w-10 h-10 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
        C
      </div>
      
      <div className="flex flex-col space-y-3 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
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
      </div>
    </div>
  );
};

export default Sidebar;
