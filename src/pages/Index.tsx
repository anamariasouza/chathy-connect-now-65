
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    // On mobile, show chat window as popup
    if (window.innerWidth < 768) {
      setShowMobileChatWindow(true);
    }
  };

  const handleCloseMobileChat = () => {
    setShowMobileChatWindow(false);
    setSelectedChat(null);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex-1 p-4 bg-gray-50">
            {/* Desktop Layout */}
            <div className="hidden md:flex gap-4 h-full">
              {/* Contacts Window */}
              <div className="w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <ChatList onChatSelect={handleChatSelect} selectedChat={selectedChat} />
              </div>
              
              {/* Messages Window */}
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
                <ChatList onChatSelect={handleChatSelect} selectedChat={null} />
              </div>

              {/* Messages Popup - Only visible when chat is selected */}
              {showMobileChatWindow && selectedChat && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full h-full max-w-md max-h-[80vh] overflow-hidden">
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
    <div className="min-h-screen flex bg-gray-100 relative">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 md:ml-20 md:pt-0">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
