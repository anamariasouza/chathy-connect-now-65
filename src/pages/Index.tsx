
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import StatusView from '@/components/StatusView';
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
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex flex-1">
            <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
            <ChatWindow chat={selectedChat} />
          </div>
        );
      case 'status':
        return <StatusView />;
      case 'calls':
        return <CallsView />;
      case 'lives':
        return <LivesView />;
      default:
        return (
          <div className="flex flex-1">
            <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
            <ChatWindow chat={selectedChat} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderMainContent()}
    </div>
  );
};

export default Index;
