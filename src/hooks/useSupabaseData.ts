
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  is_online: boolean | null;
}

interface Conversation {
  id: string;
  name: string | null;
  type: string;
  avatar_url: string | null;
  participants?: Profile[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  content: string | null;
  user_id: string;
  created_at: string;
  sender?: Profile;
}

interface Post {
  id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  user_id: string;
  created_at: string;
  likes_count: number | null;
  comments_count: number | null;
  shares_count: number | null;
  author?: Profile;
}

export const useSupabaseData = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar perfis dos usuários
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar perfis:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      return [];
    }
  };

  // Buscar conversas
  const fetchConversations = async () => {
    try {
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner (
            user_id,
            profiles!inner (
              id, username, name, avatar_url, is_online
            )
          ),
          messages (
            content,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar conversas:', error);
        return [];
      }

      return conversationsData?.map(conv => ({
        id: conv.id,
        name: conv.name,
        type: conv.type,
        avatar_url: conv.avatar_url,
        participants: conv.conversation_participants?.map((p: any) => p.profiles) || [],
        lastMessage: conv.messages?.[0]?.content || '',
        lastMessageTime: conv.messages?.[0]?.created_at ? 
          new Date(conv.messages[0].created_at).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : '',
        unreadCount: 0
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  };

  // Buscar posts
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner (
            id, username, name, avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar posts:', error);
        return [];
      }

      return data?.map(post => ({
        ...post,
        author: post.profiles
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  };

  // Buscar mensagens de uma conversa
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!inner (
            id, username, name, avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        return [];
      }

      return data?.map(message => ({
        ...message,
        sender: message.profiles
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  };

  // Enviar mensagem
  const sendMessage = async (conversationId: string, userId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          content: content
        })
        .select(`
          *,
          profiles!inner (
            id, username, name, avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Erro ao enviar mensagem:', error);
        return null;
      }

      return {
        ...data,
        sender: data.profiles
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return null;
    }
  };

  // Criar post
  const createPost = async (userId: string, content: string, mediaUrl?: string, mediaType?: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: content,
          media_url: mediaUrl,
          media_type: mediaType || 'text'
        })
        .select(`
          *,
          profiles!inner (
            id, username, name, avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Erro ao criar post:', error);
        return null;
      }

      return {
        ...data,
        author: data.profiles
      };
    } catch (error) {
      console.error('Erro ao criar post:', error);
      return null;
    }
  };

  // Carregar todos os dados
  const loadData = async () => {
    setLoading(true);
    try {
      const [profilesData, conversationsData, postsData] = await Promise.all([
        fetchProfiles(),
        fetchConversations(),
        fetchPosts()
      ]);

      setProfiles(profilesData);
      setConversations(conversationsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    profiles,
    conversations,
    posts,
    loading,
    fetchMessages,
    sendMessage,
    createPost,
    refreshData: loadData
  };
};
