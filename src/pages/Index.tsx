
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import ChatToggleButton from '@/components/ChatToggleButton';
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
  const [isChatListVisible, setIsChatListVisible] = useState(true);
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

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex flex-1 relative">
            {isChatListVisible && (
              <div className="relative">
                <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
                <ChatToggleButton 
                  isVisible={isChatListVisible}
                  onToggle={() => setIsChatListVisible(!isChatListVisible)}
                />
              </div>
            )}
            {!isChatListVisible && (
              <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
                <ChatToggleButton 
                  isVisible={isChatListVisible}
                  onToggle={() => setIsChatListVisible(!isChatListVisible)}
                />
              </div>
            )}
            <ChatWindow 
              chat={selectedChat} 
              onToggleChatList={() => setIsChatListVisible(!isChatListVisible)}
              isChatListVisible={isChatListVisible}
            />
          </div>
        );
      case 'feed':
        return <FeedView />;
      case 'lives':
        return <LivesView />;
      case 'profile':
        navigate('/profile');
        return null;
      default:
        return (
          <div className="flex flex-1 relative">
            {isChatListVisible && (
              <div className="relative">
                <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
                <ChatToggleButton 
                  isVisible={isChatListVisible}
                  onToggle={() => setIsChatListVisible(!isChatListVisible)}
                />
              </div>
            )}
            {!isChatListVisible && (
              <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
                <ChatToggleButton 
                  isVisible={isChatListVisible}
                  onToggle={() => setIsChatListVisible(!isChatListVisible)}
                />
              </div>
            )}
            <ChatWindow 
              chat={selectedChat} 
              onToggleChatList={() => setIsChatListVisible(!isChatListVisible)}
              isChatListVisible={isChatListVisible}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 ml-20">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
