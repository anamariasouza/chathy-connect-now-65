
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

const ChatToggleButton = ({ isVisible, onToggle }: ChatToggleButtonProps) => {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 bg-white border border-gray-200 shadow-md hover:bg-gray-50 w-8 h-16 p-0 rounded-r-lg"
      >
        {isVisible ? (
          <ChevronLeft size={16} className="text-gray-600" />
        ) : (
          <ChevronRight size={16} className="text-gray-600" />
        )}
      </Button>
    </div>
  );
};

export default ChatToggleButton;
