import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useAuth } from '@/hooks/useAuth';

interface PdfReportData {
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
}

const TEST_COLORS: Record<string, { r: number; g: number; b: number }> = {
  iq: { r: 59, g: 130, b: 246 }, // blue
  emotional: { r: 244, g: 63, b: 94 }, // rose
  personality: { r: 139, g: 92, b: 246 }, // violet
  career: { r: 245, g: 158, b: 11 }, // amber
  political: { r: 239, g: 68, b: 68 }, // red
};

export const usePdfDownload = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = useCallback(async (data: PdfReportData) => {
    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const color = TEST_COLORS[data.testType] || TEST_COLORS.iq;
      const userName = user?.email?.split('@')[0] || 'Participante';
      const today = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      // Helper function to check if we need a new page
      const checkNewPage = (height: number) => {
        if (y + height > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Header
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.rect(0, 0, pageWidth, 45, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NEUROX', margin, 18);

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Relatório Premium - ${data.testName}`, margin, 30);

      pdf.setFontSize(10);
      pdf.text(`Participante: ${userName}  |  Data: ${today}`, margin, 40);

      y = 55;

      // Reset text color
      pdf.setTextColor(50, 50, 50);

      // Score Section
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resultado', margin + 5, y + 10);

      pdf.setFontSize(24);
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text(`${data.score}/${data.maxScore}`, margin + 5, y + 25);

      pdf.setFontSize(14);
      pdf.setTextColor(50, 50, 50);
      pdf.text(data.resultBandName, margin + 60, y + 22);

      y += 45;

      // Description
      checkNewPage(40);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text('Análise do Perfil', margin, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      const descLines = pdf.splitTextToSize(data.description, contentWidth);
      pdf.text(descLines, margin, y);
      y += descLines.length * 5 + 10;

      // Strengths
      if (data.strengths && data.strengths.length > 0) {
        checkNewPage(30 + data.strengths.length * 6);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(34, 197, 94); // green
        pdf.text('Pontos Fortes', margin, y);
        y += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        data.strengths.forEach((strength) => {
          const lines = pdf.splitTextToSize(`• ${strength}`, contentWidth);
          pdf.text(lines, margin, y);
          y += lines.length * 5 + 2;
        });
        y += 5;
      }

      // Challenges
      if (data.challenges && data.challenges.length > 0) {
        checkNewPage(30 + data.challenges.length * 6);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(234, 179, 8); // amber
        pdf.text('Áreas para Desenvolvimento', margin, y);
        y += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        data.challenges.forEach((challenge) => {
          const lines = pdf.splitTextToSize(`• ${challenge}`, contentWidth);
          pdf.text(lines, margin, y);
          y += lines.length * 5 + 2;
        });
        y += 5;
      }

      // Recommendations
      if (data.recommendations && data.recommendations.length > 0) {
        checkNewPage(30 + data.recommendations.length * 6);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(color.r, color.g, color.b);
        pdf.text('Recomendações', margin, y);
        y += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        data.recommendations.forEach((rec, idx) => {
          const lines = pdf.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth);
          pdf.text(lines, margin, y);
          y += lines.length * 5 + 2;
        });
        y += 5;
      }

      // Career Areas
      if (data.careerAreas && data.careerAreas.length > 0) {
        checkNewPage(25);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(color.r, color.g, color.b);
        pdf.text('Áreas Profissionais Compatíveis', margin, y);
        y += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        const careersText = data.careerAreas.join(' • ');
        const careerLines = pdf.splitTextToSize(careersText, contentWidth);
        pdf.text(careerLines, margin, y);
        y += careerLines.length * 5 + 10;
      }

      // Additional Info
      if (data.additionalInfo) {
        Object.entries(data.additionalInfo).forEach(([key, value]) => {
          checkNewPage(15);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(100, 100, 100);
          pdf.text(`${key}: `, margin, y);
          pdf.setFont('helvetica', 'normal');
          pdf.text(value, margin + pdf.getTextWidth(`${key}: `), y);
          y += 6;
        });
      }

      // Disclaimer
      checkNewPage(30);
      y = pageHeight - 35;
      pdf.setFillColor(254, 243, 199); // amber-100
      pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');

      pdf.setFontSize(8);
      pdf.setTextColor(161, 98, 7); // amber-700
      pdf.setFont('helvetica', 'bold');
      pdf.text('Aviso de Uso Responsável', margin + 3, y + 6);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        'Este relatório tem finalidade educacional e informativa. Não constitui diagnóstico clínico.',
        margin + 3,
        y + 12
      );
      pdf.text(
        'Para avaliações oficiais, consulte profissionais habilitados.',
        margin + 3,
        y + 17
      );

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('NEUROX - Plataforma de Avaliações Psicométricas', pageWidth / 2, pageHeight - 8, {
        align: 'center',
      });

      // Generate filename
      const safeName = userName.replace(/[^a-zA-Z0-9]/g, '_');
      const dateStr = new Date().toISOString().split('T')[0];
      const testSlug = data.testName.replace(/\s+/g, '_').substring(0, 20);
      const filename = `NEUROX_${testSlug}_${safeName}_${dateStr}.pdf`;

      // Save PDF - works on mobile and desktop
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Try direct download first
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);

      // For iOS/Safari that may block downloads, open in new tab
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(pdfUrl, '_blank');
      } else {
        link.click();
      }

      document.body.removeChild(link);
      
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);

      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [user]);

  return { generatePdf, isGenerating };
};
