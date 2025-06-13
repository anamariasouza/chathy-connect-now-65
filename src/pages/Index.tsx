
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import FeedView from '@/components/FeedView';
import CallsView from '@/components/CallsView';
import LivesView from '@/components/LivesView';

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
      case 'calls':
        return (
          <div className="ml-20">
            <CallsView />
          </div>
        );
      case 'lives':
        return <LivesView />;
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
