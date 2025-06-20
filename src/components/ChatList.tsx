
import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
  participants?: string[];
}

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
  selectedChat: Chat | null;
}

const ChatList = ({ onChatSelect, selectedChat }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { conversations, loading } = useSupabaseData();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (conversations) {
      const formattedChats: Chat[] = conversations.map(conv => ({
        id: conv.id,
        name: conv.name || conv.participants?.map(p => p.name).join(', ') || 'Conversa',
        lastMessage: conv.lastMessage || 'Sem mensagens',
        time: conv.lastMessageTime || 'Agora',
        unread: conv.unreadCount || 0,
        avatar: conv.avatar_url || conv.participants?.[0]?.avatar_url || '/lovable-uploads/42c0170b-a517-45c3-b92f-9b7e8f6aac26.png',
        isGroup: conv.type === 'group',
        participants: conv.participants?.map(p => p.name)
      }));
      
      setChats(formattedChats);
    }
  }, [conversations]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Conversas</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chathy-primary mx-auto mb-2"></div>
            <p className="text-gray-500">Carregando conversas...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
          </div>
        ) : (
          filteredChats.map((chat) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
