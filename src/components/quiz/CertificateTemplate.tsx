import { useRef, useState } from 'react';
import { Download, Loader2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

interface CertificateTemplateProps {
  userName: string;
  testName: string;
  scoreLabel: string;
  scoreValue: string;
  issuedDate: string;
  validationCode: string;
}

const CertificateTemplate = ({
  userName,
  testName,
  scoreLabel,
  scoreValue,
  issuedDate,
  validationCode,
}: CertificateTemplateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `certificado-neurox-${validationCode}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating certificate image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `certificado-neurox-${validationCode}.png`, {
          type: 'image/png',
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Certificado NEUROX',
            text: `Meu certificado de ${testName} da NEUROX!`,
          });
        } else {
          handleDownloadPNG();
        }
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div className="overflow-x-auto">
        <div
          ref={certificateRef}
          className="relative mx-auto"
          style={{
            width: '800px',
            height: '566px',
            backgroundImage: 'url(/images/neurox-cert-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Title - Certificado de Avaliação Cognitiva */}
          <div 
            className="absolute text-center w-full"
            style={{ top: '100px' }}
          >
            <h1 
              className="text-2xl font-bold tracking-wide"
              style={{ 
                fontFamily: 'Georgia, serif',
                color: '#1a365d',
                textTransform: 'uppercase',
                letterSpacing: '4px'
              }}
            >
              Certificado de Avaliação Cognitiva
            </h1>
          </div>

          {/* Subtitle - Conferido a */}
          <div 
            className="absolute text-center w-full"
            style={{ top: '155px' }}
          >
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Georgia, serif',
                color: '#4a5568',
                fontStyle: 'italic'
              }}
            >
              Conferido a
            </p>
          </div>

          {/* Dynamic Field: User Name */}
          <div 
            className="absolute text-center w-full px-16"
            style={{ top: '180px' }}
          >
            <p 
              className="text-3xl font-bold"
              style={{ 
                fontFamily: 'Georgia, serif',
                color: '#1a365d',
              }}
            >
              {userName}
            </p>
          </div>

          {/* Dynamic Field: Test Description */}
          <div 
            className="absolute text-center w-full px-20"
            style={{ top: '235px' }}
          >
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: '#4a5568',
                fontFamily: 'Georgia, serif',
              }}
            >
              pela conclusão com êxito da Avaliação Cognitiva Online de
            </p>
            <p 
              className="text-lg font-semibold mt-1"
              style={{ 
                fontFamily: 'Georgia, serif',
                color: '#1a365d',
              }}
            >
              {testName}
            </p>
            <p 
              className="text-sm mt-1"
              style={{ 
                color: '#4a5568',
                fontFamily: 'Georgia, serif',
              }}
            >
              desenvolvida pela NEUROX, obtendo o seguinte resultado:
            </p>
          </div>

          {/* Dynamic Field: Score Result */}
          <div 
            className="absolute text-center w-full"
            style={{ top: '345px' }}
          >
            <div 
              className="inline-flex flex-col items-center justify-center px-10 py-4 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(180, 140, 80, 0.15) 0%, rgba(160, 120, 60, 0.1) 100%)',
                border: '2px solid rgba(180, 140, 80, 0.3)',
                minWidth: '200px',
              }}
            >
              <p 
                className="text-sm mb-1"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  color: '#4a5568',
                }}
              >
                {scoreLabel}
              </p>
              <p 
                className="text-3xl font-bold"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  color: '#1a365d',
                }}
              >
                {scoreValue}
              </p>
            </div>
          </div>

          {/* Dynamic Field: Date - Bottom Left */}
          <div 
            className="absolute"
            style={{
              bottom: '80px',
              left: '80px',
            }}
          >
            <p 
              className="text-xs"
              style={{ color: '#4a5568' }}
            >
              Data de Emissão
            </p>
            <p 
              className="text-sm font-medium"
              style={{ color: '#1a365d' }}
            >
              {issuedDate}
            </p>
          </div>

          {/* Dynamic Field: Validation Code - Bottom Right */}
          <div 
            className="absolute text-right"
            style={{
              bottom: '80px',
              right: '80px',
            }}
          >
            <p 
              className="text-xs"
              style={{ color: '#4a5568' }}
            >
              Código de Validação
            </p>
            <p 
              className="text-sm font-bold"
              style={{ color: '#1a365d' }}
            >
              {validationCode}
            </p>
          </div>

          {/* Institution Footer */}
          <div 
            className="absolute text-center w-full"
            style={{ bottom: '40px' }}
          >
            <p 
              className="text-xs"
              style={{ color: '#718096' }}
            >
              NEUROX - Avaliações Cognitivas Digitais • neurox.app
            </p>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <Button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          className="w-full min-h-[52px] text-base bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Baixar Certificado (PNG)
            </>
          )}
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full min-h-[48px] text-base"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default CertificateTemplate;
