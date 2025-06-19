
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
}

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
  selectedChat: Chat | null;
}

const ChatList = ({ onChatSelect, selectedChat }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Maria Silva',
      lastMessage: 'Oi! Como você está?',
      time: '14:30',
      unread: 2,
      avatar: '/lovable-uploads/2694899a-ed7c-4d27-abc6-9722b9e5bf1c.png',
      isGroup: false
    },
    {
      id: '2',
      name: 'Grupo Família',
      lastMessage: 'João: Vamos jantar hoje?',
      time: '13:45',
      unread: 5,
      avatar: '/lovable-uploads/b3c79faf-b014-4557-b3f4-17410f8bbc27.png',
      isGroup: true
    },
    {
      id: '3',
      name: 'Pedro Santos',
      lastMessage: 'Perfeito! Obrigado pela ajuda',
      time: '12:20',
      unread: 0,
      avatar: '/lovable-uploads/b9c3df60-de8a-4271-907d-dfd93761ac3f.png',
      isGroup: false
    },
    {
      id: '4',
      name: 'Trabalho Dev',
      lastMessage: 'Ana: Meeting às 15h',
      time: '11:30',
      unread: 1,
      avatar: '/lovable-uploads/9b6d18e8-018e-44fd-91cc-9a90b0724788.png',
      isGroup: true
    }
  ];

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Conversas</h2>
          <Button size="sm" className="gradient-bg">
            <Plus size={16} />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
              selectedChat?.id === chat.id ? 'bg-chathy-accent' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="bg-chathy-primary text-white">
                  {chat.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-chathy-primary rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
