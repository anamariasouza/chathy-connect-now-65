import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mistralService } from '@/services/mistralService';
import { useConversationHistory } from '@/hooks/useConversationHistory';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  isBot?: boolean;
}

interface ChatBotWindowProps {
  chat: Chat;
  onToggleChatList: () => void;
  isChatListVisible: boolean;
  showBackButton?: boolean;
}

const ChatBotWindow = ({ chat, onToggleChatList, isChatListVisible, showBackButton }: ChatBotWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getMessages, addMessage, initializeConversation } = useConversationHistory();

  // Carregar mensagens do localStorage e inicializar se necessário
  useEffect(() => {
    if (chat) {
      const savedMessages = getMessages(chat.id);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        // Inicializar com mensagem de boas-vindas
        const welcomeMessage: Message = {
          id: '1',
          content: 'Olá! Sou o Chat-Boy, seu mascote! Como posso te ajudar hoje?',
          sender: 'bot',
          timestamp: new Date(),
          isOwn: false
        };
        initializeConversation(chat.id, [welcomeMessage]);
        setMessages([welcomeMessage]);
      }
    }
  }, [chat, getMessages, initializeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setNewMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      isOwn: true
    };

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, userMessage]);
    addMessage(chat.id, userMessage);
    setNewMessage('');
    setCharCount(0);
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const botResponse = await mistralService.sendMessage(userMessage.content, conversationHistory);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isOwn: false
      };

      setMessages(prev => [...prev, botMessage]);
      addMessage(chat.id, botMessage);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro. Tente novamente!',
        sender: 'bot',
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, errorMessage]);
      addMessage(chat.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <div className="bg-[#f0f2f5] border-b border-[#e9edef] p-4 flex items-center space-x-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleChatList}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="bg-green-500 text-white">
            <Bot size={20} />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium text-[#111b21]">{chat.name}</h3>
          <p className="text-sm text-[#667781]">
            {isLoading ? 'Digitando...' : 'Mascote Verde • Online'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-[#005c4b] text-white'
                  : 'bg-white text-[#111b21] shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-[#ffffff99]' : 'text-[#667781]'
              }`}>
                {message.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-[#111b21] shadow-sm max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-[#f0f2f5] p-4 border-t border-[#e9edef]">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma mensagem... (máx. 200 caracteres)"
            className="flex-1 bg-white border-[#e9edef] resize-none min-h-[40px] max-h-[120px]"
            disabled={isLoading}
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-[#005c4b] hover:bg-[#004a3d] text-white self-end"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotWindow;
