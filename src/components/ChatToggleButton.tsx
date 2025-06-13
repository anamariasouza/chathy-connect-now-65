
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
        className="absolute top-[200px] -right-3 z-10 bg-white border border-gray-200 shadow-md hover:bg-gray-50 w-6 h-10 p-0 rounded-r-md"
      >
        {isVisible ? (
          <ChevronLeft size={12} className="text-gray-600" />
        ) : (
          <ChevronRight size={12} className="text-gray-600" />
        )}
      </Button>
    </div>
  );
};

export default ChatToggleButton;
