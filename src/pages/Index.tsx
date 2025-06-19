
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
  isBot?: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline: boolean;
  isBot?: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showMobileChatWindow, setShowMobileChatWindow] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Force light mode for WhatsApp Web style
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
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
    if (contact.isBot) return; // Não mostrar perfil para bots
    
    const fullProfile = contactProfiles.find(profile => profile.id === contact.id);
    if (fullProfile) {
      navigate('/profile', { state: { contact: fullProfile } });
    }
  };

  const handleStartChat = (contact: Contact) => {
    const newChat: Chat = {
      id: contact.id,
      name: contact.name,
      lastMessage: contact.isBot ? 'Olá! Como posso te ajudar hoje?' : '',
      time: 'agora',
      unread: 0,
      avatar: contact.avatar,
      isGroup: false,
      isBot: contact.isBot || false
    };
    setSelectedChat(newChat);
    if (window.innerWidth < 768) {
      setShowMobileChatWindow(true);
    }
  };

  const handleChatBoyClick = () => {
    const chatBoyChat: Chat = {
      id: 'chatboy',
      name: 'Chat-Boy',
      lastMessage: 'Olá! Como posso te ajudar hoje?',
      time: 'agora',
      unread: 0,
      avatar: '/lovable-uploads/4d705ce6-3586-480b-be91-7dea31336b49.png',
      isGroup: false,
      isBot: true
    };
    setSelectedChat(chatBoyChat);
    if (window.innerWidth < 768) {
      setShowMobileChatWindow(true);
    }
  };

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex-1 bg-[#f0f2f5] h-screen">
            {/* Desktop Layout - WhatsApp Web Style */}
            <div className="hidden md:flex h-full">
              {/* Left Panel - Contacts */}
              <div className="w-[30%] min-w-[300px] bg-white border-r border-[#e9edef] flex flex-col">
                <ContactManager 
                  onContactSelect={handleContactSelect}
                  onViewProfile={handleViewContactProfile}
                  onStartChat={handleStartChat}
                />
              </div>
              
              {/* Right Panel - Chat */}
              <div className="flex-1 bg-[#efeae2] relative">
                {selectedChat ? (
                  <ChatWindow 
                    chat={selectedChat} 
                    onToggleChatList={() => {}}
                    isChatListVisible={true}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-[#f8f9fa]">
                    <div className="text-center">
                      <div className="w-80 h-80 mx-auto mb-8 opacity-10">
                        <img 
                          src="/lovable-uploads/97e49b2b-0caf-467d-a8af-39923c0a7a77.png" 
                          alt="Chathy" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h2 className="text-3xl font-light text-[#41525d] mb-4">Chathy Web</h2>
                      <p className="text-[#667781] text-sm max-w-md mx-auto leading-relaxed">
                        Envie e receba mensagens sem precisar manter seu telefone conectado.<br />
                        Use o Chathy em até 4 dispositivos vinculados e 1 telefone ao mesmo tempo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden pt-16 h-full">
              <div className="bg-white h-full">
                <ContactManager 
                  onContactSelect={handleContactSelect}
                  onViewProfile={handleViewContactProfile}
                  onStartChat={handleStartChat}
                />
              </div>

              {showMobileChatWindow && selectedChat && (
                <div className="fixed inset-0 z-50 bg-white">
                  <ChatWindow 
                    chat={selectedChat} 
                    onToggleChatList={handleCloseMobileChat}
                    isChatListVisible={false}
                    showBackButton={true}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 'feed':
        return (
          <div className="pt-16 md:pt-0 bg-[#f0f2f5] min-h-screen">
            <FeedView 
              onViewProfile={handleViewContactProfile} 
              audioEnabled={audioEnabled}
              uploadDialogOpen={uploadDialogOpen}
              onUploadDialogChange={setUploadDialogOpen}
            />
          </div>
        );
      case 'lives':
        return (
          <div className="pt-16 md:pt-0 bg-[#f0f2f5] min-h-screen">
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
          <div className="pt-16 md:pt-0 bg-[#f0f2f5] min-h-screen">
            <FeedView 
              onViewProfile={handleViewContactProfile} 
              audioEnabled={audioEnabled}
              uploadDialogOpen={uploadDialogOpen}
              onUploadDialogChange={setUploadDialogOpen}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f0f2f5]">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        audioEnabled={audioEnabled}
        onAudioToggle={handleAudioToggle}
        onUploadClick={handleUploadClick}
        onChatBoyClick={handleChatBoyClick}
      />
      <div className="flex-1 md:ml-16">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
