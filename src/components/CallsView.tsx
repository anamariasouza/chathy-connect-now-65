
import { useState } from 'react';
import { Phone, Video, PhoneCall } from 'lucide-react';

interface Call {
  id: string;
  name: string;
  time: string;
  type: 'audio' | 'video';
  status: 'incoming' | 'outgoing' | 'missed';
  avatar: string;
}

const CallsView = () => {
  const [calls] = useState<Call[]>([
    {
      id: '1',
      name: 'Maria Silva',
      time: 'hoje, 14:30',
      type: 'video',
      status: 'outgoing',
      avatar: 'M'
    },
    {
      id: '2',
      name: 'Pedro Santos',
      time: 'ontem, 20:15',
      type: 'audio',
      status: 'incoming',
      avatar: 'P'
    },
    {
      id: '3',
      name: 'Ana Costa',
      time: 'ontem, 18:45',
      type: 'video',
      status: 'missed',
      avatar: 'A'
    },
    {
      id: '4',
      name: 'João Oliveira',
      time: '2 dias atrás',
      type: 'audio',
      status: 'outgoing',
      avatar: 'J'
    }
  ]);

  const getCallIcon = (type: string, status: string) => {
    if (type === 'video') {
      return <Video size={16} className={status === 'missed' ? 'text-red-500' : 'text-chathy-primary'} />;
    }
    return <Phone size={16} className={status === 'missed' ? 'text-red-500' : 'text-chathy-primary'} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missed':
        return 'text-red-500';
      case 'incoming':
        return 'text-green-600';
      case 'outgoing':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chamadas</h2>
        
        <div className="space-y-2">
          {calls.map((call) => (
            <div key={call.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-12 h-12 rounded-full bg-chathy-primary flex items-center justify-center text-white font-semibold">
                {call.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{call.name}</h3>
                <div className="flex items-center space-x-2">
                  {getCallIcon(call.type, call.status)}
                  <span className={`text-sm ${getStatusColor(call.status)}`}>
                    {call.time}
                  </span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <PhoneCall size={20} className="text-chathy-primary" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallsView;
