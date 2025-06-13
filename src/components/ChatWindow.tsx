
import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
}

interface ChatWindowProps {
  chat: Chat | null;
  onToggleChatList?: () => void;
  isChatListVisible?: boolean;
}

const ChatWindow = ({ chat, onToggleChatList, isChatListVisible }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect for mock messages
  useEffect(() => {
    if (chat) {
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Oi! Como você está?',
          sender: chat.name,
          time: '14:30',
          isOwn: false
        },
        {
          id: '2',
          text: 'Estou bem, obrigado! E você?',
          sender: 'Você',
          time: '14:32',
          isOwn: true
        },
        {
          id: '3',
          text: 'Também estou bem! Que bom te ver por aqui',
          sender: chat.name,
          time: '14:33',
          isOwn: false
        }
      ];
      setMessages(mockMessages);
    }
  }, [chat]);

  // scrollToBottom and useEffect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // handleSendMessage and handleKeyPress
  const handleSendMessage = () => {
    if (message.trim() && chat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'Você',
        time: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-chathy-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            C
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Bem-vindo ao Chathy
          </h3>
          <p className="text-gray-500">
            Selecione uma conversa para começar a conversar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold">
              {chat.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{chat.name}</h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone size={20} />
            </Button>
            <Button variant="ghost" size="sm">
              <Video size={20} />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-bubble p-3 rounded-2xl ${
                msg.isOwn
                  ? 'bg-chathy-primary text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.isOwn ? 'text-green-100' : 'text-gray-500'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip size={20} />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Digite uma mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Smile size={16} />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            className="gradient-bg"
            disabled={!message.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
