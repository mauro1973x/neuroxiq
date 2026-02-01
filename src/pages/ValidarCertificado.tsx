import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Award, Calendar, Trophy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ValidationData {
  test_name: string | null;
  score_label: string | null;
  score_value: string | null;
  total_score: number | null;
  iq_estimated: number | null;
  result_category: string | null;
  certificate_issued_at: string | null;
  validation_code: string | null;
}

interface ProfileData {
  full_name: string | null;
}

const ValidarCertificado = () => {
  const { validationCode } = useParams<{ validationCode: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [certificateData, setCertificateData] = useState<ValidationData | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const validateCertificate = async () => {
      if (!validationCode) {
        setIsLoading(false);
        return;
      }

      console.log('[VALIDAR] Checking validation code:', validationCode);

      try {
        // Fetch certificate data by validation code
        const { data: attemptData, error } = await supabase
          .from('test_attempts')
          .select('user_id, test_name, score_label, score_value, total_score, iq_estimated, result_category, certificate_issued_at, validation_code, has_certificate')
          .eq('validation_code', validationCode.toUpperCase())
          .eq('has_certificate', true)
          .single();

        if (error || !attemptData) {
          console.log('[VALIDAR] Certificate not found:', error?.message);
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        console.log('[VALIDAR] Certificate found:', attemptData);
        setCertificateData(attemptData as ValidationData);
        setIsValid(true);

        // Get certificate holder name via secure function
        // This function validates the certificate and returns only the name
        const { data: holderName, error: holderError } = await supabase
          .rpc('get_certificate_holder_name', { p_validation_code: validationCode.toUpperCase() });

        if (!holderError && holderName) {
          setUserName(holderName);
        }
      } catch (err) {
        console.error('[VALIDAR] Error:', err);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateCertificate();
  }, [validationCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Verificando certificado...</p>
        </div>
      </div>
    );
  }

  const testName = certificateData?.test_name || 'Avaliação Cognitiva';
  const scoreLabel = certificateData?.score_label || 'Resultado';
  const scoreValue = certificateData?.score_value || 
    (certificateData?.iq_estimated ? String(certificateData.iq_estimated) : 
    (certificateData?.result_category || String(certificateData?.total_score || '-')));
  const issuedDate = certificateData?.certificate_issued_at 
    ? format(new Date(certificateData.certificate_issued_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : '-';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 px-4">
        <div className="max-w-lg mx-auto">
          {isValid ? (
            <Card className="border-2 border-success/50 bg-success/5">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-success" />
                  </div>
                </div>
                <Badge className="mx-auto mb-3 bg-success/20 text-success border-success/30">
                  Certificado Válido
                </Badge>
                <CardTitle className="text-xl md:text-2xl">Certificado Autêntico</CardTitle>
                <CardDescription className="text-base">
                  Este certificado foi emitido oficialmente pela NEUROX
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Certificate Details */}
                <div className="space-y-4">
                  {userName && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                      <Trophy className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Titular</p>
                        <p className="font-semibold">{userName}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teste Realizado</p>
                      <p className="font-semibold">{testName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                    <Trophy className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">{scoreLabel}</p>
                      <p className="font-semibold">{scoreValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Emissão</p>
                      <p className="font-semibold">{issuedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Validation Code Display */}
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-muted">
                  <p className="text-sm text-muted-foreground mb-1">Código de Validação</p>
                  <p className="text-lg font-mono font-bold tracking-wider">{validationCode?.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-destructive/50 bg-destructive/5">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-destructive" />
                  </div>
                </div>
                <Badge variant="destructive" className="mx-auto mb-3">
                  Certificado Inválido
                </Badge>
                <CardTitle className="text-xl md:text-2xl">Código Não Encontrado</CardTitle>
                <CardDescription className="text-base">
                  O código de validação informado não corresponde a nenhum certificado emitido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-muted">
                  <p className="text-sm text-muted-foreground mb-1">Código Informado</p>
                  <p className="text-lg font-mono font-bold tracking-wider text-muted-foreground">
                    {validationCode?.toUpperCase() || 'N/A'}
                  </p>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Verifique se o código foi digitado corretamente.</p>
                  <p>Se você recebeu este código de terceiros, ele pode ser inválido ou falsificado.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-muted-foreground">
              Quer fazer sua própria avaliação cognitiva?
            </p>
            <Link to="/testes">
              <Button size="lg" className="min-h-[52px] w-full sm:w-auto">
                <ExternalLink className="h-5 w-5 mr-2" />
                Fazer um Teste
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ValidarCertificado;
