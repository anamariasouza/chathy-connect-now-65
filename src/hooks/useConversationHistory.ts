
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ConversationHistory {
  [chatId: string]: Message[];
}

export const useConversationHistory = () => {
  const [conversations, setConversations] = useState<ConversationHistory>({});

  // Carregar conversas do localStorage na inicialização
  useEffect(() => {
    const savedConversations = localStorage.getItem('chathy_conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Converter timestamps de volta para Date objects
        const converted: ConversationHistory = {};
        Object.keys(parsed).forEach(chatId => {
          converted[chatId] = parsed[chatId].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        setConversations(converted);
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      }
    }
  }, []);

  // Salvar conversas no localStorage sempre que houver mudanças
  useEffect(() => {
    if (Object.keys(conversations).length > 0) {
      localStorage.setItem('chathy_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const getMessages = (chatId: string): Message[] => {
    return conversations[chatId] || [];
  };

  const addMessage = (chatId: string, message: Message) => {
    setConversations(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message]
    }));
  };

  const initializeConversation = (chatId: string, initialMessages: Message[]) => {
    if (!conversations[chatId] || conversations[chatId].length === 0) {
      setConversations(prev => ({
        ...prev,
        [chatId]: initialMessages
      }));
    }
  };

  const clearConversation = (chatId: string) => {
    setConversations(prev => {
      const updated = { ...prev };
      delete updated[chatId];
      return updated;
    });
  };

  return {
    getMessages,
    addMessage,
    initializeConversation,
    clearConversation
  };
};
