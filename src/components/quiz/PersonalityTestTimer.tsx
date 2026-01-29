import { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface PersonalityTestTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const PersonalityTestTimer = ({ initialMinutes, onTimeUp, isRunning }: PersonalityTestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

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

  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCriticalTime = timeLeft <= 60; // 1 minute

  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg transition-colors ${
        isCriticalTime 
          ? 'bg-destructive/20 text-destructive animate-pulse' 
          : isLowTime 
            ? 'bg-warning/20 text-warning' 
            : 'bg-muted'
      }`}
    >
      <Clock className="h-5 w-5" />
      <span className="font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default PersonalityTestTimer;
