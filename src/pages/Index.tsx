
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import Sidebar from '@/components/Sidebar';
import FeedView from '@/components/FeedView';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import ContactManager from '@/components/ContactManager';
import StatusView from '@/components/StatusView';
import LivesView from '@/components/LivesView';
import ChatToggleButton from '@/components/ChatToggleButton';

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

interface Contact {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline: boolean;
  isGroup?: boolean;
  participants?: string[];
  isBot?: boolean;
  isFixed?: boolean;
}

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatListVisible, setIsChatListVisible] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a884] mx-auto mb-4"></div>
          <p className="text-[#667781]">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!user) {
    return <Auth />;
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setIsChatListVisible(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    // Converter contato para chat para compatibilidade
    const chat: Chat = {
      id: contact.id,
      name: contact.name,
      lastMessage: '',
      time: 'agora',
      unread: 0,
      avatar: contact.avatar,
      isGroup: contact.isGroup || false,
      participants: contact.participants
    };
    setSelectedChat(chat);
    setCurrentView('chats');
    if (window.innerWidth < 768) {
      setIsChatListVisible(false);
    }
  };

  const toggleChatList = () => {
    setIsChatListVisible(!isChatListVisible);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'feed':
        return <FeedView />;
      case 'chats':
        return (
          <div className="flex h-full">
            {isChatListVisible && (
              <ChatList
                onChatSelect={handleChatSelect}
                selectedChat={selectedChat}
              />
            )}
            <div className="flex-1 flex flex-col">
              <ChatWindow
                chat={selectedChat}
                onToggleChatList={toggleChatList}
                isChatListVisible={isChatListVisible}
                showBackButton={!isChatListVisible}
              />
            </div>
          </div>
        );
      case 'contacts':
        return (
          <ContactManager
            onContactSelect={handleContactSelect}
            onStartChat={handleContactSelect}
          />
        );
      case 'status':
        return <StatusView />;
      case 'lives':
        return <LivesView />;
      case 'games':
        return <div className="flex-1 flex items-center justify-center text-gray-500">Jogos em breve...</div>;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={currentView} 
        onTabChange={setCurrentView} 
      />
      <main className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-16 pt-16 md:pt-0">
        {renderMainContent()}
      </main>
      {currentView === 'chats' && (
        <ChatToggleButton 
          isVisible={isChatListVisible} 
          onToggle={toggleChatList} 
        />
      )}
    </div>
  );
};

export default Index;
