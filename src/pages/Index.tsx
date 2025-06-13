
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import FeedView from '@/components/FeedView';
import LivesView from '@/components/LivesView';
import Profile from './Profile';
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
          <div className="flex flex-1 ml-20">
            <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
            <ChatWindow chat={selectedChat} />
          </div>
        );
      case 'feed':
        return <FeedView />;
      case 'lives':
        return <LivesView />;
      case 'profile':
        return (
          <div className="ml-20">
            <Profile />
          </div>
        );
      default:
        return (
          <div className="flex flex-1 ml-20">
            <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
            <ChatWindow chat={selectedChat} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderMainContent()}
    </div>
  );
};

export default Index;
