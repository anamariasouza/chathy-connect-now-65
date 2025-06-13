
import { useState } from 'react';
import { Plus, User, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline: boolean;
}

interface ContactManagerProps {
  onContactSelect?: (contact: Contact) => void;
  onViewProfile?: (contact: Contact) => void;
}

const ContactManager = ({ onContactSelect, onViewProfile }: ContactManagerProps) => {
  const [contacts] = useState<Contact[]>([
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
  const [showActions, setShowActions] = useState<string | null>(null);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    onContactSelect?.(contact);
  };

  const handleViewProfile = (contact: Contact) => {
    onViewProfile?.(contact);
  };

  const handleEditContact = (contact: Contact) => {
    console.log('Editar contato:', contact.name);
  };

  const handleDeleteContact = (contact: Contact) => {
    console.log('Deletar contato:', contact.name);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-chathy-primary text-white">
                      {contact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{contact.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(contact);
                  }}
                  className="p-2"
                >
                  <Eye size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditContact(contact);
                  }}
                  className="p-2"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContact(contact);
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactManager;
