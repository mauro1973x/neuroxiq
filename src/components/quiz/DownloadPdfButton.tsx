import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePdfDownload } from '@/hooks/usePdfDownload';
import { useToast } from '@/hooks/use-toast';

interface DownloadPdfButtonProps {
  testType: 'iq' | 'emotional' | 'personality' | 'career' | 'political';
  testName: string;
  score: number;
  maxScore: number;
  resultBandName: string;
  description: string;
  strengths?: string[];
  challenges?: string[];
  recommendations?: string[];
  careerAreas?: string[];
  additionalInfo?: Record<string, string>;
  variant?: 'header' | 'sticky' | 'inline';
}

const DownloadPdfButton = ({
  testType,
  testName,
  score,
  maxScore,
  resultBandName,
  description,
  strengths,
  challenges,
  recommendations,
  careerAreas,
  additionalInfo,
  variant = 'header',
}: DownloadPdfButtonProps) => {
  const { generatePdf, isGenerating } = usePdfDownload();
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await generatePdf({
      testType,
      testName,
      score,
      maxScore,
      resultBandName,
      description,
      strengths,
      challenges,
      recommendations,
      careerAreas,
      additionalInfo,
    });

    if (success) {
      toast({
        title: 'PDF Gerado!',
        description: 'Seu relatório foi baixado com sucesso.',
      });
    } else {
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    }
  };

  // Header variant - small button for desktop header
  if (variant === 'header') {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="print:hidden hidden md:flex"
        onClick={handleDownload}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Baixar PDF
      </Button>
    );
  }

  // Sticky variant - fixed bottom on mobile
  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden print:hidden bg-background/95 backdrop-blur-sm border-t border-border safe-area-bottom">
        <div className="container py-3 px-4">
          <Button
            variant="premium"
            size="lg"
            className="w-full h-14 text-base font-bold shadow-lg"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Baixar Relatório em PDF
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Inline variant - full-width button
  return (
    <div className="w-full max-w-md mx-auto px-4 print:hidden">
      <Button
        variant="premium"
        size="lg"
        className="w-full h-12"
        onClick={handleDownload}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Gerando PDF...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Baixar Relatório em PDF
          </>
        )}
      </Button>
    </div>
  );
};

export default DownloadPdfButton;
