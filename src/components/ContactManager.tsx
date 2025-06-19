
import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
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
}

interface ContactManagerProps {
  onContactSelect?: (contact: Contact) => void;
  onViewProfile?: (contact: Contact) => void;
  onStartChat?: (contact: Contact) => void;
}

const ContactManager = ({ onContactSelect, onViewProfile, onStartChat }: ContactManagerProps) => {
  const [contacts] = useState<Contact[]>([
    {
      id: 'group1',
      name: 'Grupo Família',
      avatar: 'GF',
      username: 'grupofamilia',
      isOnline: true,
      isGroup: true,
      participants: ['Maria Silva', 'Pedro Santos', 'João Silva']
    },
    {
      id: 'group2',
      name: 'Trabalho Dev',
      avatar: 'TD',
      username: 'trabalhodev',
      isOnline: true,
      isGroup: true,
      participants: ['Ana Costa', 'Pedro Santos', 'Maria Silva']
    },
    {
      id: '1',
      name: 'Maria Silva',
      avatar: 'M',
      username: 'mariasilva',
      isOnline: true
    },
    {
      id: '2',
      name: 'Pedro Santos',
      avatar: 'P',
      username: 'pedrosantos',
      isOnline: false
    },
    {
      id: '3',
      name: 'Ana Costa',
      avatar: 'A',
      username: 'anacosta',
      isOnline: true
    },
    {
      id: '4',
      name: 'João Silva',
      avatar: 'J',
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
    if (!contact.isGroup) {
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
            }`}
            onClick={() => handleContactClick(contact)}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="relative cursor-pointer"
                onClick={(e) => handleAvatarClick(contact, e)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={`${contact.isGroup ? 'bg-purple-500' : 'bg-chathy-primary'} text-white`}>
                    {contact.avatar}
                  </AvatarFallback>
                </Avatar>
                {contact.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                    <Users size={8} className="text-white" />
                  </div>
                )}
                {!contact.isGroup && contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                  {contact.isGroup && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full">
                      Grupo
                    </span>
                  )}
                </div>
                {contact.isGroup && contact.participants ? (
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
