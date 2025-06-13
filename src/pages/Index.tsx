
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
  const [lastSelectedChat, setLastSelectedChat] = useState<Chat | null>(null);
  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Store the last selected chat when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setLastSelectedChat(selectedChat);
    }
  }, [selectedChat]);

  // When chat list becomes visible and there's a last selected chat, restore it
  useEffect(() => {
    if (isChatListVisible && lastSelectedChat && !selectedChat) {
      setSelectedChat(lastSelectedChat);
    }
  }, [isChatListVisible, lastSelectedChat, selectedChat]);

  if (!isAuthenticated) {
    return null;
  }

  const handleToggleChatList = () => {
    setIsChatListVisible(!isChatListVisible);
  };

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
                  onToggle={handleToggleChatList}
                />
              </div>
            )}
            {!isChatListVisible && (
              <div className="fixed left-24 top-1/2 transform -translate-y-1/2 z-40">
                <ChatToggleButton 
                  isVisible={isChatListVisible}
                  onToggle={handleToggleChatList}
                />
              </div>
            )}
            <div className={`flex-1 ${isChatListVisible ? 'ml-6' : 'ml-16'}`}>
              <ChatWindow 
                chat={selectedChat} 
                onToggleChatList={handleToggleChatList}
                isChatListVisible={isChatListVisible}
              />
            </div>
          </div>
        );
      case 'feed':
        return <FeedView />;
      case 'lives':
        return <LivesView />;
      case 'games':
        navigate('/games');
        return null;
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
                  onToggle={handleToggleChatList}
                />
              </div>
            )}
            {!isChatListVisible && (
              <div className="fixed left-24 top-1/2 transform -translate-y-1/2 z-40">
                <ChatToggleButton 
                  isVisible={isChatListVisible}
                  onToggle={handleToggleChatList}
                />
              </div>
            )}
            <div className={`flex-1 ${isChatListVisible ? 'ml-6' : 'ml-16'}`}>
              <ChatWindow 
                chat={selectedChat} 
                onToggleChatList={handleToggleChatList}
                isChatListVisible={isChatListVisible}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative pb-20 md:pb-0">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 md:ml-20">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
