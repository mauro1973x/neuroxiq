import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PoliticalTestTimerProps {
  totalMinutes: number;
  onTimeUp: () => void;
}

const PoliticalTestTimer = ({ totalMinutes, onTimeUp }: PoliticalTestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const totalSeconds = totalMinutes * 60;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / totalSeconds) * 100;
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
      ${isLowTime ? 'bg-destructive/20 text-destructive' : 'bg-muted/50 text-muted-foreground'}
    `}>
      {isLowTime ? (
        <AlertTriangle className="h-5 w-5 animate-pulse" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <div className="flex flex-col min-w-[80px]">
        <span className="text-lg font-mono font-bold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <Progress 
          value={progress} 
          className={`h-1 ${isLowTime ? '[&>div]:bg-destructive' : ''}`}
        />
      </div>
    </div>
  );
};

export default PoliticalTestTimer;
