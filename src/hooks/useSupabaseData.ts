
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
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar conversas:', error);
        return [];
      }

      // Para cada conversa, buscar os participantes e a última mensagem
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Buscar participantes
          const { data: participantsData } = await supabase
            .from('conversation_participants')
            .select(`
              profiles (
                id, username, name, avatar_url, is_online
              )
            `)
            .eq('conversation_id', conv.id);

          // Buscar última mensagem
          const { data: messagesData } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            id: conv.id,
            name: conv.name,
            type: conv.type,
            avatar_url: conv.avatar_url,
            participants: participantsData?.map((p: any) => p.profiles).filter(Boolean) || [],
            lastMessage: messagesData?.[0]?.content || '',
            lastMessageTime: messagesData?.[0]?.created_at ? 
              new Date(messagesData[0].created_at).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : '',
            unreadCount: 0
          };
        })
      );

      return conversationsWithDetails;
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  };

  // Buscar posts
  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar posts:', error);
        return [];
      }

      // Para cada post, buscar o autor
      const postsWithAuthors = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, name, avatar_url')
            .eq('id', post.user_id)
            .single();

          return {
            ...post,
            author: profileData || undefined
          };
        })
      );

      return postsWithAuthors;
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  };

  // Buscar mensagens de uma conversa
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        return [];
      }

      // Para cada mensagem, buscar o remetente
      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, name, avatar_url')
            .eq('id', message.user_id)
            .single();

          return {
            ...message,
            sender: profileData || undefined
          };
        })
      );

      return messagesWithSenders;
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
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao enviar mensagem:', error);
        return null;
      }

      // Buscar o remetente
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url')
        .eq('id', data.user_id)
        .single();

      return {
        ...data,
        sender: profileData || undefined
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
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao criar post:', error);
        return null;
      }

      // Buscar o autor
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url')
        .eq('id', data.user_id)
        .single();

      return {
        ...data,
        author: profileData || undefined
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
