import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, X, Users, User, Mic, Camera, FileText, Image, MicIcon, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { contactProfiles } from '@/data/contactProfiles';
import EmojiPicker from 'emoji-picker-react';
import ChatBotWindow from './ChatBotWindow';
import GroupDetailsPopup from './GroupDetailsPopup';
import { useConversationHistory } from '@/hooks/useConversationHistory';

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

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
  participants?: string[];
  isBot?: boolean;
}

interface ChatWindowProps {
  chat: Chat | null;
  onToggleChatList?: () => void;
  isChatListVisible?: boolean;
  showBackButton?: boolean;
}

const ChatWindow = ({ chat, onToggleChatList, isChatListVisible, showBackButton }: ChatWindowProps) => {
  // Se for um chat com bot, usar o ChatBotWindow
  if (chat?.isBot) {
    return (
      <ChatBotWindow
        chat={chat}
        onToggleChatList={onToggleChatList}
        isChatListVisible={isChatListVisible}
        showBackButton={showBackButton}
      />
    );
  }

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { getMessages, addMessage, initializeConversation } = useConversationHistory();

  // useEffect for messages with localStorage
  useEffect(() => {
    if (chat) {
      const savedMessages = getMessages(chat.id);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        // Inicializar com mensagens de exemplo mais realistas
        let initialMessages: Message[] = [];
        
        if (chat.isGroup) {
          initialMessages = [
            {
              id: '1',
              content: 'Pessoal, vamos organizar nosso próximo encontro!',
              sender: 'Maria Silva',
              timestamp: new Date(Date.now() - 3600000),
              isOwn: false
            },
            {
              id: '2',
              content: 'Ótima ideia! Que tal no final de semana?',
              sender: 'Você',
              timestamp: new Date(Date.now() - 3300000),
              isOwn: true
            },
            {
              id: '3',
              content: 'Sábado à tarde funciona para mim',
              sender: 'Pedro Santos',
              timestamp: new Date(Date.now() - 3000000),
              isOwn: false
            },
            {
              id: '4',
              content: 'Perfeito! Vou criar o evento no grupo',
              sender: 'João Silva',
              timestamp: new Date(Date.now() - 2700000),
              isOwn: false
            }
          ];
        } else {
          const contactExamples = {
            'Maria Silva': [
              {
                id: '1',
                content: 'Oi! Vi suas fotos da viagem, que lugar incrível!',
                sender: 'Maria Silva',
                timestamp: new Date(Date.now() - 1800000),
                isOwn: false
              },
              {
                id: '2',
                content: 'Muito obrigado! Foi uma experiência incrível mesmo',
                sender: 'Você',
                timestamp: new Date(Date.now() - 1500000),
                isOwn: true
              },
              {
                id: '3',
                content: 'Temos que planejar uma viagem juntos em breve!',
                sender: 'Maria Silva',
                timestamp: new Date(Date.now() - 1200000),
                isOwn: false
              }
            ],
            'Pedro Santos': [
              {
                id: '1',
                content: 'E aí, como foi o projeto que você estava desenvolvendo?',
                sender: 'Pedro Santos',
                timestamp: new Date(Date.now() - 2400000),
                isOwn: false
              },
              {
                id: '2',
                content: 'Foi um sucesso! Cliente ficou muito satisfeito',
                sender: 'Você',
                timestamp: new Date(Date.now() - 2100000),
                isOwn: true
              },
              {
                id: '3',
                content: 'Que ótimo! Parabéns pelo trabalho 👏',
                sender: 'Pedro Santos',
                timestamp: new Date(Date.now() - 1800000),
                isOwn: false
              }
            ],
            'Ana Costa': [
              {
                id: '1',
                content: 'Olha só essa foto que tirei hoje! 📸',
                sender: 'Ana Costa',
                timestamp: new Date(Date.now() - 3600000),
                isOwn: false
              },
              {
                id: '2',
                content: 'Que linda! Você tem um olhar único para fotografia',
                sender: 'Você',
                timestamp: new Date(Date.now() - 3300000),
                isOwn: true
              },
              {
                id: '3',
                content: 'Obrigada! Estou preparando uma exposição',
                sender: 'Ana Costa',
                timestamp: new Date(Date.now() - 3000000),
                isOwn: false
              }
            ],
            'João Silva': [
              {
                id: '1',
                content: 'Escuta essa música que acabei de produzir! 🎵',
                sender: 'João Silva',
                timestamp: new Date(Date.now() - 4200000),
                isOwn: false
              },
              {
                id: '2',
                content: 'Cara, ficou incrível! Que batida marcante',
                sender: 'Você',
                timestamp: new Date(Date.now() - 3900000),
                isOwn: true
              },
              {
                id: '3',
                content: 'Valeu! Vai fazer parte do meu próximo álbum',
                sender: 'João Silva',
                timestamp: new Date(Date.now() - 3600000),
                isOwn: false
              }
            ]
          };

          initialMessages = contactExamples[chat.name as keyof typeof contactExamples] || [
            {
              id: '1',
              content: 'Olá! Como você está?',
              sender: chat.name,
              timestamp: new Date(Date.now() - 1800000),
              isOwn: false
            },
            {
              id: '2',
              content: 'Oi! Estou bem, obrigado! E você?',
              sender: 'Você',
              timestamp: new Date(Date.now() - 1500000),
              isOwn: true
            },
            {
              id: '3',
              content: 'Também estou bem! Que bom falar com você',
              sender: chat.name,
              timestamp: new Date(Date.now() - 1200000),
              isOwn: false
            }
          ];
        }
        
        initializeConversation(chat.id, initialMessages);
        setMessages(initialMessages);
      }
    }
  }, [chat, getMessages, initializeConversation]);

  // scrollToBottom and useEffect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio recording functions
  const cleanupRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    setMediaRecorder(null);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioChunks([]);
  };

  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      console.log('Iniciando gravação...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      setAudioStream(stream);
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      cleanupRecording();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording && !isPaused) {
      console.log('Pausando gravação...');
      mediaRecorder.pause();
      setIsPaused(true);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isRecording && isPaused) {
      console.log('Retomando gravação...');
      mediaRecorder.resume();
      setIsPaused(false);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const sendAudio = () => {
    if (mediaRecorder && audioChunks.length > 0) {
      console.log('Enviando áudio...');
      
      mediaRecorder.stop();
      
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: 'Áudio',
        sender: 'Você',
        timestamp: new Date(),
        isOwn: true,
        type: 'audio',
        fileUrl: audioUrl
      };
      
      setMessages(prev => [...prev, newMessage]);
      addMessage(chat!.id, newMessage);
      
      cleanupRecording();
    }
  };

  const cancelRecording = () => {
    console.log('Cancelando gravação...');
    cleanupRecording();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const file = event.target.files?.[0];
    if (file && chat) {
      const fileUrl = URL.createObjectURL(file);
      let messageText = '';
      
      switch (type) {
        case 'image':
          messageText = 'Foto';
          break;
        case 'video':
          messageText = 'Vídeo';
          break;
        case 'file':
          messageText = file.name;
          break;
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageText,
        sender: 'Você',
        timestamp: new Date(),
        isOwn: true,
        type: type,
        fileUrl: fileUrl,
        fileName: file.name
      };
      
      setMessages(prev => [...prev, newMessage]);
      addMessage(chat.id, newMessage);
      setShowAttachmentMenu(false);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // handleSendMessage and handleKeyPress
  const handleSendMessage = () => {
    if (message.trim() && chat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'Você',
        timestamp: new Date(),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      addMessage(chat.id, newMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleParticipantClick = (participantName: string) => {
    // Encontrar o perfil do participante
    const participantProfile = contactProfiles.find(profile => profile.name === participantName);
    
    if (participantProfile) {
      // Navegar para o perfil
      navigate('/profile', { state: { contact: participantProfile } });
    } else {
      // Se não encontrar o perfil, criar um chat particular
      const newChat: Chat = {
        id: `chat_${participantName.replace(' ', '_').toLowerCase()}`,
        name: participantName,
        lastMessage: '',
        time: 'agora',
        unread: 0,
        avatar: participantName.charAt(0),
        isGroup: false
      };
      
      console.log('Iniciando chat com:', participantName);
      // Aqui você pode implementar a lógica para iniciar o chat
    }
  };

  const handleGroupAvatarClick = () => {
    if (chat?.isGroup) {
      setShowGroupDetails(true);
    }
  };

  // renderMessage function
  const renderMessage = (msg: Message) => {
    if (msg.type === 'audio') {
      return (
        <div className="flex items-center space-x-2">
          <MicIcon size={16} />
          <audio controls src={msg.fileUrl} className="max-w-48">
            Seu navegador não suporta áudio.
          </audio>
        </div>
      );
    }
    
    if (msg.type === 'image') {
      return (
        <div>
          <img src={msg.fileUrl} alt="Imagem" className="max-w-48 rounded-lg mb-2" />
          <p className="text-sm">{msg.content}</p>
        </div>
      );
    }
    
    if (msg.type === 'video') {
      return (
        <div>
          <video src={msg.fileUrl} controls className="max-w-48 rounded-lg mb-2">
            Seu navegador não suporta vídeo.
          </video>
          <p className="text-sm">{msg.content}</p>
        </div>
      );
    }
    
    if (msg.type === 'file') {
      return (
        <div className="flex items-center space-x-2">
          <FileText size={16} />
          <a href={msg.fileUrl} download={msg.fileName} className="text-blue-600 hover:underline">
            {msg.fileName}
          </a>
        </div>
      );
    }
    
    return <p className="text-sm">{msg.content}</p>;
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-chathy-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            C
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Bem-vindo ao Chathy
          </h3>
          <p className="text-gray-500">
            Selecione uma conversa para começar a conversar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className={`w-10 h-10 rounded-full ${chat.isGroup ? 'bg-purple-500' : 'bg-chathy-primary'} flex items-center justify-center text-white font-semibold ${chat.isGroup ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={chat.isGroup ? handleGroupAvatarClick : undefined}
            >
              {chat.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                {chat.isGroup && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    Grupo
                  </span>
                )}
              </div>
              {chat.isGroup && chat.participants ? (
                <div className="flex items-center space-x-1">
                  <p className="text-sm text-gray-500">{chat.participants.length} participantes</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="p-1 h-auto"
                  >
                    <Users size={14} className="text-gray-500" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-green-600">Online</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Phone size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Video size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <MoreVertical size={20} />
            </Button>
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onToggleChatList}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-600" />
              </Button>
            )}
          </div>
        </div>

        {/* Participants List */}
        {chat.isGroup && showParticipants && chat.participants && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Participantes:</h4>
            <div className="space-y-2">
              {chat.participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleParticipantClick(participant)}
                >
                  <div className="w-8 h-8 bg-chathy-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {participant.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-800">{participant}</span>
                  <User size={12} className="text-gray-400 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-bubble p-3 rounded-2xl max-w-xs ${
                msg.isOwn
                  ? 'bg-chathy-primary text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {!msg.isOwn && chat.isGroup && (
                <p 
                  className="text-xs font-semibold mb-1 text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleParticipantClick(msg.sender)}
                >
                  {msg.sender}
                </p>
              )}
              {renderMessage(msg)}
              <p className={`text-xs mt-1 ${
                msg.isOwn ? 'text-green-100' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white relative">
        {/* Recording interface */}
        {(isRecording || isPaused) && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className={`text-sm font-medium ${isPaused ? 'text-yellow-600' : 'text-red-600'}`}>
                {isPaused ? 'Pausado' : 'Gravando'}: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  size="sm"
                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                >
                  <Pause size={16} />
                  Pausar
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Play size={16} />
                  Retomar
                </Button>
              )}
              <Button
                onClick={cancelRecording}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X size={16} />
                Cancelar
              </Button>
              <Button
                onClick={sendAudio}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={!isRecording && !isPaused}
              >
                <Send size={16} />
                Enviar
              </Button>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg border p-2 z-40">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 justify-start"
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowAttachmentMenu(false);
                }}
              >
                <Image size={16} className="text-blue-500" />
                <span>Foto ou Vídeo</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 justify-start"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf,.doc,.docx,.txt';
                  input.onchange = (e) => handleFileUpload(e as any, 'file');
                  input.click();
                  setShowAttachmentMenu(false);
                }}
              >
                <FileText size={16} className="text-purple-500" />
                <span>Documento</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 justify-start"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'audio/*';
                  input.onchange = (e) => handleFileUpload(e as any, 'file');
                  input.click();
                  setShowAttachmentMenu(false);
                }}
              >
                <MicIcon size={16} className="text-green-500" />
                <span>Áudio</span>
              </Button>
            </div>
          </div>
        )}

        {!(isRecording || isPaused) && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <Paperclip size={20} />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder={chat.isGroup ? "Mensagem para o grupo..." : "Digite uma mensagem..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 bg-gray-100 border-gray-300 text-black placeholder-gray-500"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={16} />
              </Button>
            </div>
            {message.trim() ? (
              <Button 
                onClick={handleSendMessage}
                className="bg-[#00a884] hover:bg-[#008069] text-white"
              >
                <Send size={20} />
              </Button>
            ) : (
              <Button 
                onClick={startRecording}
                className="bg-[#00a884] hover:bg-[#008069] text-white"
              >
                <Mic size={20} />
              </Button>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const isVideo = file.type.startsWith('video/');
              handleFileUpload(e, isVideo ? 'video' : 'image');
            }
          }}
          className="hidden"
        />
      </div>

      {/* Group Details Popup */}
      {chat.isGroup && chat.participants && (
        <GroupDetailsPopup
          isOpen={showGroupDetails}
          onClose={() => setShowGroupDetails(false)}
          groupName={chat.name}
          groupAvatar={chat.avatar}
          participants={chat.participants}
          onStartPrivateChat={handleParticipantClick}
          onViewProfile={(participant) => {
            const participantProfile = contactProfiles.find(profile => profile.name === participant);
            if (participantProfile) {
              navigate('/profile', { state: { contact: participantProfile } });
            }
          }}
        />
      )}
    </div>
  );
};

export default ChatWindow;
