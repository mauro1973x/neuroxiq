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
        scale: 3, // High resolution
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
          className="relative mx-auto bg-white"
          style={{
            width: '800px',
            height: '566px',
            backgroundImage: 'url(/images/neurox-cert-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* User Name Overlay */}
          <div 
            className="absolute text-center"
            style={{
              top: '230px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
            }}
          >
            <p 
              className="font-serif text-3xl font-bold text-[#1a365d]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {userName}
            </p>
          </div>

          {/* Test Description Overlay */}
          <div 
            className="absolute text-center"
            style={{
              top: '290px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
            }}
          >
            <p 
              className="text-sm text-gray-700"
              style={{ lineHeight: '1.6' }}
            >
              concluiu com êxito a Avaliação Cognitiva Online de {testName}
              <br />
              desenvolvida pela NEUROX obtendo o seguinte resultado:
            </p>
          </div>

          {/* Score Result Overlay */}
          <div 
            className="absolute text-center"
            style={{
              top: '360px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
            }}
          >
            <p 
              className="text-2xl font-bold text-[#1a365d]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {scoreLabel}: {scoreValue}
            </p>
          </div>

          {/* Date Overlay */}
          <div 
            className="absolute"
            style={{
              bottom: '60px',
              left: '60px',
            }}
          >
            <p className="text-sm text-gray-600">{issuedDate}</p>
          </div>

          {/* Validation Code Overlay */}
          <div 
            className="absolute text-right"
            style={{
              bottom: '45px',
              right: '60px',
            }}
          >
            <p className="text-sm font-bold text-[#1a365d]">NEUROX - Avaliações Cognitivas Digitais</p>
            <p className="text-xs text-gray-600">Código de validação: {validationCode}</p>
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
