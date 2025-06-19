
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import FeedView from '@/components/FeedView';
import LivesView from '@/components/LivesView';
import ContactManager from '@/components/ContactManager';
import { useAuth } from '@/hooks/useAuth';
import { contactProfiles } from '@/data/contactProfiles';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showMobileChatWindow, setShowMobileChatWindow] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Forçar modo escuro permanentemente
  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Remover classe light se existir
    document.documentElement.classList.remove('light');
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

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleViewContactProfile = (contact: Contact) => {
    // Encontrar o perfil completo do contato
    const fullProfile = contactProfiles.find(profile => profile.id === contact.id);
    if (fullProfile) {
      navigate('/profile', { state: { contact: fullProfile } });
    }
  };

  const handleStartChat = (contact: Contact) => {
    // Criar um chat com este contato
    const newChat: Chat = {
      id: contact.id,
      name: contact.name,
      lastMessage: '',
      time: 'agora',
      unread: 0,
      avatar: contact.avatar,
      isGroup: false
    };
    setSelectedChat(newChat);
    if (window.innerWidth < 768) {
      setShowMobileChatWindow(true);
    }
  };

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex-1 p-4 bg-gray-900 transition-colors duration-300">
            {/* Desktop Layout */}
            <div className="hidden md:flex gap-4 h-full">
              {/* Contacts Window */}
              <div className="w-1/3 bg-gray-800 rounded-xl shadow-gray-900/50 overflow-hidden transition-colors duration-300">
                <ContactManager 
                  onContactSelect={handleContactSelect}
                  onViewProfile={handleViewContactProfile}
                  onStartChat={handleStartChat}
                />
              </div>
              
              {/* Messages Window */}
              <div className="flex-1 bg-gray-800 rounded-xl shadow-gray-900/50 overflow-hidden transition-colors duration-300">
                <ChatWindow 
                  chat={selectedChat} 
                  onToggleChatList={() => {}}
                  isChatListVisible={true}
                />
              </div>
            </div>

            {/* Mobile Layout - Centralized */}
            <div className="md:hidden h-full flex items-center justify-center">
              <div className="bg-gray-800 rounded-xl shadow-gray-900/50 overflow-hidden transition-colors duration-300 w-full max-w-md mx-4" style={{ height: '70vh' }}>
                <ContactManager 
                  onContactSelect={handleContactSelect}
                  onViewProfile={handleViewContactProfile}
                  onStartChat={handleStartChat}
                />
              </div>

              {/* Messages Popup - Only visible when contact is selected */}
              {showMobileChatWindow && selectedChat && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-colors duration-300 w-full h-full max-w-md max-h-[80vh]">
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
            <FeedView onViewProfile={handleViewContactProfile} audioEnabled={audioEnabled} />
          </div>
        );
      case 'lives':
        return (
          <div className="pt-20 md:pt-0">
            <LivesView onViewProfile={handleViewContactProfile} audioEnabled={audioEnabled} />
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
            <FeedView onViewProfile={handleViewContactProfile} audioEnabled={audioEnabled} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 relative transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        audioEnabled={audioEnabled}
        onAudioToggle={handleAudioToggle}
      />
      <div className="flex-1 md:ml-20 md:pt-0">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
