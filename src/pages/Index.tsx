
import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import SimpleLogin from '@/components/SimpleLogin';
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
  const { currentUser, isAuthenticated, login } = useCurrentUser();
  const [currentView, setCurrentView] = useState('feed');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatListVisible, setIsChatListVisible] = useState(true);

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated || !currentUser) {
    return <SimpleLogin onLogin={login} />;
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
    setCurrentView('chat');
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
      case 'chat':
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
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderMainContent()}
      </main>
      <ChatToggleButton onClick={toggleChatList} />
    </div>
  );
};

export default Index;
