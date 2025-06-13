
import { useState } from 'react';
import { MessageCircle, Users, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Conversas' },
    { id: 'status', icon: Users, label: 'Status' },
    { id: 'calls', icon: Phone, label: 'Chamadas' },
    { id: 'lives', icon: Video, label: 'Lives' },
  ];

  return (
    <div className="w-20 bg-chathy-dark flex flex-col items-center py-4 space-y-4">
      <div className="w-12 h-12 bg-chathy-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
        C
      </div>
      
      <div className="flex flex-col space-y-2 mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
              activeTab === item.id
                ? "bg-chathy-primary text-white"
                : "text-chathy-primary hover:bg-chathy-primary/20"
            )}
          >
            <item.icon size={24} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
