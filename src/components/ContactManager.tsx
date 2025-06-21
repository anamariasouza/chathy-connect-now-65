
import { useState } from 'react';
import { Plus, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

interface ContactManagerProps {
  onContactSelect?: (contact: Contact) => void;
  onViewProfile?: (contact: Contact) => void;
  onStartChat?: (contact: Contact) => void;
}

const ContactManager = ({ onContactSelect, onViewProfile, onStartChat }: ContactManagerProps) => {
  const [contacts] = useState<Contact[]>([
    {
      id: 'chatboy',
      name: 'Chat-Boy',
      avatar: '/lovable-uploads/4d705ce6-3586-480b-be91-7dea31336b49.png',
      username: 'chatboy',
      isOnline: true,
      isBot: true,
      isFixed: true
    },
    {
      id: 'group1',
      name: 'Grupo Família',
      avatar: '/lovable-uploads/b3c79faf-b014-4557-b3f4-17410f8bbc27.png',
      username: 'grupofamilia',
      isOnline: true,
      isGroup: true,
      participants: ['Maria Silva', 'Pedro Santos', 'João Silva']
    },
    {
      id: 'group2',
      name: 'Trabalho Dev',
      avatar: '/lovable-uploads/9b6d18e8-018e-44fd-91cc-9a90b0724788.png',
      username: 'trabalhodev',
      isOnline: true,
      isGroup: true,
      participants: ['Ana Costa', 'Pedro Santos', 'Maria Silva']
    },
    {
      id: '1',
      name: 'Maria Silva',
      avatar: '/lovable-uploads/2694899a-ed7c-4d27-abc6-9722b9e5bf1c.png',
      username: 'mariasilva',
      isOnline: true
    },
    {
      id: '2',
      name: 'Pedro Santos',
      avatar: '/lovable-uploads/b9c3df60-de8a-4271-907d-dfd93761ac3f.png',
      username: 'pedrosantos',
      isOnline: false
    },
    {
      id: '3',
      name: 'Ana Costa',
      avatar: '/lovable-uploads/5deded1d-8e0c-45ac-9406-da311468b1d3.png',
      username: 'anacosta',
      isOnline: true
    },
    {
      id: '4',
      name: 'João Silva',
      avatar: '/lovable-uploads/42c0170b-a517-45c3-b92f-9b7e8f6aac26.png',
      username: 'joaosilva',
      isOnline: true
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    onContactSelect?.(contact);
    onStartChat?.(contact);
  };

  const handleAvatarClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contact.isGroup && !contact.isBot) {
      onViewProfile?.(contact);
    }
  };

  const handleAddContact = () => {
    console.log('Adicionar novo contato');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Contatos</h2>
          <Button
            onClick={handleAddContact}
            size="sm"
            className="bg-chathy-primary hover:bg-chathy-primary/90 text-white"
          >
            <Plus size={16} className="mr-1" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            } ${contact.isFixed ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' : ''}`}
            onClick={() => handleContactClick(contact)}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="relative cursor-pointer"
                onClick={(e) => handleAvatarClick(contact, e)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className={`${contact.isGroup ? 'bg-purple-500' : contact.isBot ? 'bg-green-500' : 'bg-chathy-primary'} text-white`}>
                    {contact.isBot ? <Bot size={20} /> : contact.isGroup ? <Users size={20} /> : contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {contact.isBot && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                    <Bot size={8} className="text-white" />
                  </div>
                )}
                {contact.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                    <Users size={8} className="text-white" />
                  </div>
                )}
                {!contact.isGroup && !contact.isBot && contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                  {contact.isBot && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded-full">
                      IA
                    </span>
                  )}
                  {contact.isGroup && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full">
                      Grupo
                    </span>
                  )}
                </div>
                {contact.isBot ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Inteligente e sempre disponível
                  </p>
                ) : contact.isGroup && contact.participants ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contact.participants.length} participantes
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{contact.username}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactManager;
