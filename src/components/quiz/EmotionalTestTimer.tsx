import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface EmotionalTestTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const EmotionalTestTimer = ({ initialMinutes, onTimeUp, isRunning }: EmotionalTestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft < 180; // Less than 3 minutes
  const isCriticalTime = timeLeft < 60; // Less than 1 minute

  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors ${
        isCriticalTime 
          ? 'bg-destructive/20 text-destructive animate-pulse' 
          : isLowTime 
            ? 'bg-warning/20 text-warning' 
            : 'bg-rose-500/10 text-rose-600'
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default EmotionalTestTimer;
