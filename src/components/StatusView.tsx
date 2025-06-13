
import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Status {
  id: string;
  name: string;
  time: string;
  avatar: string;
  viewed: boolean;
}

const StatusView = () => {
  const [statuses] = useState<Status[]>([
    {
      id: '1',
      name: 'Meu Status',
      time: 'Toque para adicionar',
      avatar: 'V',
      viewed: true
    },
    {
      id: '2',
      name: 'Maria Silva',
      time: 'há 2 min',
      avatar: 'M',
      viewed: false
    },
    {
      id: '3',
      name: 'Pedro Santos',
      time: 'há 15 min',
      avatar: 'P',
      viewed: true
    },
    {
      id: '4',
      name: 'Ana Costa',
      time: 'há 1 hora',
      avatar: 'A',
      viewed: false
    }
  ]);

  return (
    <div className="flex-1 bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Status</h2>
        
        <div className="space-y-4">
          {statuses.map((status, index) => (
            <div key={status.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold ${
                  index === 0 ? 'bg-gray-400' : 'bg-chathy-primary'
                }`}>
                  {status.avatar}
                </div>
                {!status.viewed && index !== 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-chathy-primary rounded-full border-2 border-white"></div>
                )}
                {index === 0 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-chathy-primary rounded-full flex items-center justify-center">
                    <Plus size={14} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{status.name}</h3>
                <p className="text-sm text-gray-600">{status.time}</p>
              </div>
              {status.viewed && index !== 0 && (
                <Eye size={16} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusView;
