
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import FeedView from '@/components/FeedView';
import LivesView from '@/components/LivesView';
import { useAuth } from '@/hooks/useAuth';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showMobileChatWindow, setShowMobileChatWindow] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setShowMobileChatWindow(true);
    }
  };

  const handleCloseMobileChat = () => {
    setShowMobileChatWindow(false);
    setSelectedChat(null);
  };

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        mainBg: 'bg-gray-900',
        windowBg: 'bg-gray-800',
        borderColor: 'border-gray-700',
        shadowColor: 'shadow-gray-900/50'
      };
    } else {
      return {
        mainBg: 'bg-gray-50',
        windowBg: 'bg-white',
        borderColor: 'border-gray-200',
        shadowColor: 'shadow-lg'
      };
    }
  };

  const theme = getThemeColors();

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className={`flex-1 p-4 ${theme.mainBg} transition-colors duration-300`}>
            {/* Desktop Layout */}
            <div className="hidden md:flex gap-4 h-full">
              {/* Contacts Window */}
              <div className={`w-1/3 ${theme.windowBg} rounded-xl ${theme.shadowColor} ${theme.borderColor} border overflow-hidden transition-colors duration-300`}>
                <ChatList onChatSelect={handleChatSelect} selectedChat={selectedChat} />
              </div>
              
              {/* Messages Window */}
              <div className={`flex-1 ${theme.windowBg} rounded-xl ${theme.shadowColor} ${theme.borderColor} border overflow-hidden transition-colors duration-300`}>
                <ChatWindow 
                  chat={selectedChat} 
                  onToggleChatList={() => {}}
                  isChatListVisible={true}
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden h-full relative">
              {/* Contacts Window - Full Width on Mobile */}
              <div className={`${theme.windowBg} rounded-xl ${theme.shadowColor} ${theme.borderColor} border overflow-hidden h-full transition-colors duration-300`}>
                <ChatList onChatSelect={handleChatSelect} selectedChat={null} />
              </div>

              {/* Messages Popup - Only visible when chat is selected */}
              {showMobileChatWindow && selectedChat && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className={`${theme.windowBg} rounded-xl shadow-2xl ${theme.borderColor} border w-full h-full max-w-md max-h-[80vh] overflow-hidden transition-colors duration-300`}>
                    <ChatWindow 
                      chat={selectedChat} 
                      onToggleChatList={handleCloseMobileChat}
                      isChatListVisible={false}
                      showBackButton={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'feed':
        return (
          <div className="pt-20 md:pt-0">
            <FeedView />
          </div>
        );
      case 'lives':
        return (
          <div className="pt-20 md:pt-0">
            <LivesView />
          </div>
        );
      case 'games':
        navigate('/games');
        return null;
      case 'profile':
        navigate('/profile');
        return null;
      default:
        return (
          <div className="pt-20 md:pt-0">
            <FeedView />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex ${theme.mainBg} relative transition-colors duration-300`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 md:ml-20 md:pt-0">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
