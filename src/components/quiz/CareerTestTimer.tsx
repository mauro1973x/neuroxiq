import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CareerTestTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const CareerTestTimer = ({ initialMinutes, onTimeUp, isRunning }: CareerTestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const isLowTime = timeLeft <= 300; // 5 minutes warning
  const isCriticalTime = timeLeft <= 60; // 1 minute critical

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg ${
      isCriticalTime 
        ? 'bg-destructive/20 text-destructive animate-pulse' 
        : isLowTime 
          ? 'bg-warning/20 text-warning'
          : 'bg-muted text-foreground'
    }`}>
      {isCriticalTime ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default CareerTestTimer;
