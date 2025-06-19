
import { Users, X, Phone, Video, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GroupDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupAvatar: string;
  participants: string[];
  onStartPrivateChat?: (participantName: string) => void;
  onViewProfile?: (participantName: string) => void;
}

const GroupDetailsPopup = ({ 
  isOpen, 
  onClose, 
  groupName, 
  groupAvatar, 
  participants,
  onStartPrivateChat,
  onViewProfile
}: GroupDetailsPopupProps) => {
  const handleParticipantClick = (participant: string) => {
    onStartPrivateChat?.(participant);
    onClose();
  };

  const handleViewProfile = (participant: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProfile?.(participant);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-purple-500 text-white text-lg">
                {groupAvatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg">{groupName}</DialogTitle>
              <p className="text-sm text-gray-500">{participants.length} participantes</p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex space-x-2 mb-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone size={16} className="mr-1" />
              Ligar
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Video size={16} className="mr-1" />
              Vídeo
            </Button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Users size={16} className="mr-2" />
              Participantes
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleParticipantClick(participant)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-chathy-primary text-white text-sm">
                      {participant.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{participant}</p>
                    <p className="text-xs text-gray-500">@{participant.toLowerCase().replace(' ', '')}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleViewProfile(participant, e)}
                      className="p-1 h-6 w-6"
                    >
                      <Users size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleParticipantClick(participant)}
                      className="p-1 h-6 w-6"
                    >
                      <MessageCircle size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsPopup;
