import jsPDF from 'jspdf';
import { getFormByFormId } from '../firebase/formSubmission';

// Define the data structure for Form A and Form B
export interface FormAData {
  A1: string;
  A2: string;
  A3: string;
  A4: string;
  A5: string;
  A6: string;
  A7: string;
  A8: string;
  A9: string;
  A4_description: string;
  A4_stress_percentage: string;
  A4_production_loss: string;
  A4_sick_leave_cost: string;
  // Form B fields
  B3: string; // Insatsnamn
  B4: string; // Vilka insatser avses
  B5: string; // Syfte med insatserna
  B6: string; // Stöd för verksamhetens övergripande mål
  B7: string; // Alternativa ansatser
  B8: string; // Mål med insatserna
  B9: string; // Målgrupp
  B10: string; // När nås förväntad effekt av insatsen
  B11: string; // Genomförandeplan
  // Form C fields
  C5: string; // Vinst i företaget, kr per år
  C7: string; // Andel av personalen med hög stressnivå (%)
  C8: string; // Produktionsbortfall vid hög stressnivå (%)
  C12: string; // Andel av kort sjukfrånvaro som beror på psykisk ohälsa
  C13: string; // Kostnad för kort sjukfrånvaro beroende på psykisk ohälsa, kr per år
  C15: string; // Andel av lång sjukfrånvaro som beror på psykisk ohälsa
  C16: string; // Kostnad för lång sjukfrånvaro beroende på psykisk ohälsa, kr per år
  C18: string; // Värde av produktionsbortfall, kr per år
  C19: string; // Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år
  C20: string; // Total kostnad för psykisk ohälsa, kr per år
  // Form D fields
  D1: string; // Genomsnittlig månadslön
  D2: string; // Sociala avgifter inkl arb.givaravgift, tjänstepension och försäkringar (%)
  D3: string; // Genomsnittliga sociala avgifter per månad
  D4: string; // Antal anställda (motsvarande heltidstjänster/FTE)
  D5: string; // Antal månader som beräkningen avser
  D6: string; // Totala lönekostnader, kr
  D7: string; // Personalkringkostnader i % av lönekostnader
  D8: string; // Totala personalkringkostnader, kr
  D9: string; // Totala personalkostnader, kr. Överförs till C4
  D10: string; // Schemalagd arbetstid (timmar) per år
  D11: string; // Personalkostnad kr. per arbetad timme
  // Form E fields
  E1: string; // Genomsnittlig månadslön
  E2: string; // Kostnad för kort sjukfrånvaro per sjukdag % av månadslön
  E3: string; // Kostnad för kort sjukfrånvaro per sjukdag, kr
  E4: string; // Antal anställda (motsvarande heltidstjänster/FTE)
  E5: string; // Antal schemalagda arbetsdagar per år, per anställd
  E6: string; // Sjukfrånvaro, kort (dag 1-14) i % av schemalagd arbetstid
  E7: string; // Antal sjukdagar totalt (kort sjukfrånvaro)
  E8: string; // Totala kostnader, kort sjukfrånvaro, överförs till C11
  // Form F fields
  F1: string; // Genomsnittlig månadslön
  F2: string; // Kostnad för lång sjukfrånvaro per sjukdag i % av månadslön
  F3: string; // Kostnad för lång sjukfrånvaro per sjukdag, kr
  F4: string; // Antal anställda (motsvarande heltidstjänster/FTE)
  F5: string; // Antal schemalagda arbetsdagar per år, per anställd
  F6: string; // Sjukfrånvaro, lång (dag 15 --) i % av schemalagd arbetstid
  F7: string; // Antal sjukdagar totalt (lång sjukfrånvaro)
  F8: string; // Totala kostnader, lång sjukfrånvaro, överförs till C14
  // Form G fields
  G1: string; // Organisationens namn
  G2: string; // Kontaktperson
  G3_start: string; // Tidsperiod (12 månader) - startdatum
  G3_end: string; // Tidsperiod (12 månader) - slutdatum
  // Section 1
  G4_name: string; // Insatsnamn 1
  G5_name: string; // Delinsats 1.1
  G5_external: string; // Delinsats 1.1 - Externa kostnader
  G5_internal: string; // Delinsats 1.1 - Interna kostnader
  G6_name: string; // Delinsats 1.2
  G6_external: string; // Delinsats 1.2 - Externa kostnader
  G6_internal: string; // Delinsats 1.2 - Interna kostnader
  G7_name: string; // Delinsats 1.3
  G7_external: string; // Delinsats 1.3 - Externa kostnader
  G7_internal: string; // Delinsats 1.3 - Interna kostnader
  G8_name: string; // Delinsats 1.4
  G8_external: string; // Delinsats 1.4 - Externa kostnader
  G8_internal: string; // Delinsats 1.4 - Interna kostnader
  G9_external: string; // Delsumma 1 - Externa kostnader
  G9_internal: string; // Delsumma 1 - Interna kostnader
  G9_total: string; // Totalt för insats 1
  // Section 2
  G10_name: string; // Insatsnamn 2
  G11_name: string; // Delinsats 2.1
  G11_external: string; // Delinsats 2.1 - Externa kostnader
  G11_internal: string; // Delinsats 2.1 - Interna kostnader
  G12_name: string; // Delinsats 2.2
  G12_external: string; // Delinsats 2.2 - Externa kostnader
  G12_internal: string; // Delinsats 2.2 - Interna kostnader
  G13_name: string; // Delinsats 2.3
  G13_external: string; // Delinsats 2.3 - Externa kostnader
  G13_internal: string; // Delinsats 2.3 - Interna kostnader
  G14_name: string; // Delinsats 2.4
  G14_external: string; // Delinsats 2.4 - Externa kostnader
  G14_internal: string; // Delinsats 2.4 - Interna kostnader
  G15_external: string; // Delsumma 2 - Externa kostnader
  G15_internal: string; // Delsumma 2 - Interna kostnader
  G15_total: string; // Totalt för insats 2
  // Section 3
  G16_name: string; // Insatsnamn 3
  G17_name: string; // Delinsats 3.1
  G17_external: string; // Delinsats 3.1 - Externa kostnader
  G17_internal: string; // Delinsats 3.1 - Interna kostnader
  G18_name: string; // Delinsats 3.2
  G18_external: string; // Delinsats 3.2 - Externa kostnader
  G18_internal: string; // Delinsats 3.2 - Interna kostnader
  G19_name: string; // Delinsats 3.3
  G19_external: string; // Delinsats 3.3 - Externa kostnader
  G19_internal: string; // Delinsats 3.3 - Interna kostnader
  G20_name: string; // Delinsats 3.4
  G20_external: string; // Delinsats 3.4 - Externa kostnader
  G20_internal: string; // Delinsats 3.4 - Interna kostnader
  G21_external: string; // Delsumma 3 - Externa kostnader
  G21_internal: string; // Delsumma 3 - Interna kostnader
  G21_total: string; // Totalt för insats 3
  // Section 4
  G22_name: string; // Insatsnamn 4
  G23_name: string; // Delinsats 4.1
  G23_external: string; // Delinsats 4.1 - Externa kostnader
  G23_internal: string; // Delinsats 4.1 - Interna kostnader
  G24_name: string; // Delinsats 4.2
  G24_external: string; // Delinsats 4.2 - Externa kostnader
  G24_internal: string; // Delinsats 4.2 - Interna kostnader
  G25_name: string; // Delinsats 4.3
  G25_external: string; // Delinsats 4.3 - Externa kostnader
  G25_internal: string; // Delinsats 4.3 - Interna kostnader
  G26_name: string; // Delinsats 4.4
  G26_external: string; // Delinsats 4.4 - Externa kostnader
  G26_internal: string; // Delinsats 4.4 - Interna kostnader
  G27_external: string; // Delsumma 4 - Externa kostnader
  G27_internal: string; // Delsumma 4 - Interna kostnader
  G27_total: string; // Totalt för insats 4
  // Section 5
  G28_name: string; // Insatsnamn 5
  G29_name: string; // Delinsats 5.1
  G29_external: string; // Delinsats 5.1 - Externa kostnader
  G29_internal: string; // Delinsats 5.1 - Interna kostnader
  G30_name: string; // Delinsats 5.2
  G30_external: string; // Delinsats 5.2 - Externa kostnader
  G30_internal: string; // Delinsats 5.2 - Interna kostnader
  G31_name: string; // Delinsats 5.3
  G31_external: string; // Delinsats 5.3 - Externa kostnader
  G31_internal: string; // Delinsats 5.3 - Interna kostnader
  G32_name: string; // Delinsats 5.4
  G32_external: string; // Delinsats 5.4 - Externa kostnader
  G32_internal: string; // Delinsats 5.4 - Interna kostnader
  G33_external: string; // Delsumma 5 - Externa kostnader
  G33_internal: string; // Delsumma 5 - Interna kostnader
  G33_total: string; // Totalt för insats 5
  // Grand Total
  G34: string; // Total kostnad för insatsen
  G34_external: string; // TOTALT - Externa kostnader
  G34_internal: string; // TOTALT - Interna kostnader
  G34_total: string; // TOTALT ALLA INSATSER
  // Form J fields
  J5: string; // Total kostnad för psykisk ohälsa, kr per år
  J6: string; // Minskad andel av personal med hög stressnivå
  J7: string; // Ekonomisk nytta av insatsen, kr per år
  J8: string; // Total kostnad för insatsen, kr
  J9: string; // Ekonomiskt överskott av insatsen (år 1)
  J11: string; // Return on investment (ROI), %, alt 1
  J17: string; // Minskad andel av personal med hög stressnivå för break even, %, alt 3
  // Form H fields
  H1: string; // Organisationens namn
  H2: string; // Kontaktperson
}

// Function to generate a PDF report
export async function generatePDFReport(data: FormAData, language: 'sv' | 'en' = 'sv'): Promise<jsPDF> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Page margins and dimensions
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - (margin * 2);
  let currentY = 0;
  
  // Translation helper
  const t = (sv: string, en: string): string => {
    return language === 'sv' ? sv : en;
  };
  
  // Helper function to safely format numbers with fallback
  const safeFormatNumber = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null || value === '') {
      return t('Ej angivet', 'Not specified');
    }
    try {
      return `${formatNumber(value)} ${t('kr', 'SEK')}`;
    } catch (error) {
      console.error('Error formatting number:', error);
      return t('Ej angivet', 'Not specified');
    }
  };

  // Function to add a section header with text wrapping
  const addSectionHeader = (title: string, bgColor = [220, 230, 240]) => {
    // Add some space before the header
    currentY += 10;
    
    // Convert title to string and prepare for wrapping
    const titleStr = String(title);
    const titleWidth = pageWidth - 10;
    const titleLines = doc.splitTextToSize(titleStr, titleWidth);
    
    // Calculate required height based on number of lines
    const lineHeight = 5;
    const titleLinesCount = titleLines.length;
    const headerHeight = Math.max(titleLinesCount * lineHeight + 4, 10);
    
    // Draw header background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]); // Background color
    doc.rect(margin, currentY, pageWidth, headerHeight, 'F');
    
    // Add header text
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    
    // Position text vertically centered in the header
    const titleYPosition = currentY + 5 + (headerHeight - titleLinesCount * lineHeight) / 2;
    doc.text(titleLines, margin + 5, titleYPosition);
    
    currentY += headerHeight + 5;
  };
  
  // Function to add a table row with proper text wrapping and dynamic height
  const addTableRow = (label: string, value: string, isHeader = false, isTotal = false) => {
    // Convert inputs to strings
    const labelStr = String(label);
    const valueStr = String(value);
    
    // Calculate available widths for text
    const labelWidth = pageWidth * 0.6 - 10; // Label column width with padding
    const valueWidth = pageWidth * 0.4 - 10; // Value column width with padding
    
    // Split text to fit within column widths
    const labelLines = doc.splitTextToSize(labelStr, labelWidth);
    const valueLines = doc.splitTextToSize(valueStr, valueWidth);
    
    // Calculate required row height based on the column with more lines
    const lineHeight = 5; // Height per line of text
    const labelLinesCount = labelLines.length;
    const valueLinesCount = valueLines.length;
    const maxLines = Math.max(labelLinesCount, valueLinesCount);
    
    // Calculate dynamic row height with minimum height and padding
    const rowHeight = Math.max(maxLines * lineHeight + 4, 10); // Minimum 10mm height
    
    // Check if the row will fit on the current page, if not add a new page
    if (currentY + rowHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      currentY = margin;
    }
    
    // Set background color based on row type
    if (isHeader) {
      doc.setFillColor(240, 240, 240); // Light gray for header rows
    } else if (isTotal) {
      doc.setFillColor(230, 240, 230); // Light green for total rows
    } else {
      doc.setFillColor(255, 255, 255); // White for regular rows
    }
    
    // Draw row background
    doc.rect(margin, currentY, pageWidth, rowHeight, 'F');
    
    // Draw row borders
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, margin + pageWidth, currentY); // Top border
    doc.line(margin, currentY + rowHeight, margin + pageWidth, currentY + rowHeight); // Bottom border
    doc.line(margin, currentY, margin, currentY + rowHeight); // Left border
    doc.line(margin + pageWidth, currentY, margin + pageWidth, currentY + rowHeight); // Right border
    doc.line(margin + pageWidth * 0.6, currentY, margin + pageWidth * 0.6, currentY + rowHeight); // Column divider
    
    // Set font style
    if (isHeader || isTotal) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    // Set text properties
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Calculate vertical position for text to center it in the row
    const labelYPosition = currentY + 5 + (rowHeight - labelLinesCount * lineHeight) / 2;
    const valueYPosition = currentY + 5 + (rowHeight - valueLinesCount * lineHeight) / 2;
    
    // Add text with proper vertical positioning
    doc.text(labelLines, margin + 5, labelYPosition);
    doc.text(valueLines, margin + pageWidth * 0.6 + 5, valueYPosition);
    
    // Update current Y position
    currentY += rowHeight;
  };

  // Function to add a metric box
  const addMetricBox = (title: string, value: string, width = pageWidth / 2 - 5) => {
    // Check if the box will fit on the current page, if not add a new page
    if (currentY + 30 > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      currentY = margin;
    }
    
    // Draw box background
    doc.setFillColor(245, 247, 250); // Light blue-gray background
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, width, 25, 3, 3, 'FD');
    
    // Add title
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(title, margin + 5, currentY + 8);
    
    // Add value
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 5, currentY + 18);
    
    return width + 5; // Return the width used (including margin)
  };

  // Function to add a chart (simulated with rectangles of different heights)
  const addBarChart = (title: string, data: { label: string, value: number }[], maxValue: number) => {
    // Add title
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, currentY + 10);
    
    currentY += 15;
    
    // Chart dimensions
    const chartWidth = pageWidth;
    const chartHeight = 40;
    const barWidth = chartWidth / data.length - 5;
    
    // Check if the chart will fit on the current page, if not add a new page
    if (currentY + chartHeight + 20 > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      currentY = margin;
    }
    
    // Draw chart background
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, chartWidth, chartHeight, 'FD');
    
    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (chartHeight - 10);
      const barX = margin + (index * (barWidth + 5)) + 5;
      const barY = currentY + chartHeight - barHeight - 5;
      
      // Draw bar
      doc.setFillColor(100, 150, 200);
      doc.rect(barX, barY, barWidth, barHeight, 'F');
      
      // Add label
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');
      
      // Wrap label if needed
      const labelLines = doc.splitTextToSize(item.label, barWidth);
      doc.text(labelLines, barX + barWidth / 2, currentY + chartHeight + 5, { align: 'center' });
      
      // Add value on top of bar
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(formatNumber(item.value), barX + barWidth / 2, barY - 2, { align: 'center' });
    });
    
    currentY += chartHeight + 20;
  };

  // Function to add a pie chart as a table with visual representation
  const addPieChartAsTable = (title: string, data: { label: string, value: number, color: number[] }[]) => {
    // Add title
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, currentY + 10);
    
    currentY += 15;
    
    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, pageWidth, 8, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(t('Kategori', 'Category'), margin + 5, currentY + 5);
    doc.text(t('Värde (SEK)', 'Value (SEK)'), margin + pageWidth * 0.4, currentY + 5);
    doc.text(t('Andel', 'Percentage'), margin + pageWidth * 0.7, currentY + 5);
    
    currentY += 8;
    
    // Table rows
    data.forEach((item) => {
      const rowHeight = 10;
      const percentage = Math.round((item.value / total) * 100);
      
      // Draw row background
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, pageWidth, rowHeight, 'F');
      
      // Draw color indicator
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(margin + 2, currentY + 2, 6, 6, 'F');
      
      // Add text
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(item.label, margin + 12, currentY + 6);
      doc.text(formatNumber(item.value), margin + pageWidth * 0.4, currentY + 6);
      doc.text(`${percentage}%`, margin + pageWidth * 0.7, currentY + 6);
      
      // Draw bottom border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(margin, currentY + rowHeight, margin + pageWidth, currentY + rowHeight);
      
      currentY += rowHeight;
    });
    
    // Total row
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, currentY, pageWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(t('Totalt', 'Total'), margin + 5, currentY + 6);
    doc.text(formatNumber(totalValue), margin + pageWidth * 0.4, currentY + 6);
    doc.text('100%', margin + pageWidth * 0.7, currentY + 6);
    
    currentY += 15;
    
    // Add a visual representation of the distribution using horizontal bars
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(t('Visuell fördelning', 'Visual Distribution'), margin, currentY);
    
    currentY += 8;
    
    // Draw distribution bar
    const barHeight = 15;
    let currentX = margin;
    
    data.forEach((item) => {
      const percentage = item.value / total;
      const barWidth = pageWidth * percentage;
      
      // Draw segment
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(currentX, currentY, barWidth, barHeight, 'F');
      
      // Add percentage label if segment is wide enough
      if (barWidth > 15) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(`${Math.round(percentage * 100)}%`, currentX + barWidth / 2, currentY + barHeight / 2 + 3, { align: 'center' });
      }
      
      currentX += barWidth;
    });
    
    currentY += barHeight + 15;
  };

  // 1. Cover Page & Executive Summary
  const logoUrl = 'https://i.postimg.cc/x1PkvmGq/SENTION-logo-Black-Transparent-BG.png';
  const imgWidth = 50;
  const imgHeight = 50;
  const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
  const imgY = 20;

  // Add logo
  doc.addImage(logoUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);

  // Add title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text(t('ROI-analysrapport', 'ROI Analysis Report'), doc.internal.pageSize.getWidth() / 2, imgY + imgHeight + 20, { align: 'center' });

  // Add organization name and contact person
  doc.setFontSize(16);
  doc.text(`${data.A1 || t('Organisationsnamn', 'Organization Name')}`, doc.internal.pageSize.getWidth() / 2, imgY + imgHeight + 35, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`${t('Kontaktperson', 'Contact Person')}: ${data.A2 || t('Ej angivet', 'Not specified')}`, doc.internal.pageSize.getWidth() / 2, imgY + imgHeight + 45, { align: 'center' });
  doc.text(`${t('Datum', 'Date')}: ${new Date().toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US')}`, doc.internal.pageSize.getWidth() / 2, imgY + imgHeight + 55, { align: 'center' });

  // Add executive summary
  currentY = imgY + imgHeight + 70;
  
  // Add executive summary header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, currentY, pageWidth, 10, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('Sammanfattning', 'Executive Summary'), margin + 5, currentY + 7);
  
  currentY += 15;
  
  // Add executive summary text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryText = t(
    `Denna rapport presenterar en analys av de ekonomiska konsekvenserna av psykisk ohälsa inom ${data.A1 || 'organisationen'} samt förväntad avkastning på investeringar i förebyggande åtgärder. Analysen visar att organisationen förlorar cirka ${safeFormatNumber(data.C20)} per år på grund av psykisk ohälsa, men kan uppnå en ROI på ${data.J11 || '0'}% genom att investera i förebyggande insatser.`,
    `This report presents an analysis of the economic impact of mental health issues within ${data.A1 || 'the organization'} and the expected return on investment in preventive measures. The analysis shows that the organization loses approximately ${safeFormatNumber(data.C20)} per year due to mental health issues, but can achieve an ROI of ${data.J11 || '0'}% by investing in preventive measures.`
  );
  
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth);
  doc.text(summaryLines, margin, currentY);
  
  currentY += summaryLines.length * 5 + 10;
  
  // Add key metrics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t('Nyckeltal', 'Key Metrics'), margin, currentY);
  
  currentY += 10;
  
  // Add metric boxes in a 2x2 grid
  addMetricBox(t('Total kostnad för psykisk ohälsa per år', 'Total cost of mental health issues per year'), safeFormatNumber(data.C20));
  addMetricBox(t('ROI för förebyggande insatser', 'ROI for preventive measures'), `${data.J11 || '0'}%`, pageWidth / 2 - 5);
  
  currentY += 30;
  addMetricBox(t('Investering i förebyggande insatser', 'Investment in preventive measures'), safeFormatNumber(data.G34 || data.G34_total));
  addMetricBox(t('Förväntad ekonomisk nytta per år', 'Expected economic benefit per year'), safeFormatNumber(data.J7), pageWidth / 2 - 5);

  // 2. Business Analysis - Understanding the Problem
  doc.addPage();
  currentY = margin;
  
  addSectionHeader(t('Nuvarande situation och riskanalys', 'Current Situation and Risk Analysis'), [220, 230, 240]);
  
  // Add narrative text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const businessAnalysisText = t(
    `Företaget ${data.A1 || 'Ej angivet'} har identifierat utmaningar relaterade till psykisk ohälsa bland personalen. ${data.A4_description || data.A4 || 'Ej angivet'}`,
    `The company ${data.A1 || 'Not specified'} has identified challenges related to mental health issues among staff. ${data.A4_description || data.A4 || 'Not specified'}`
  );
  
  const businessAnalysisLines = doc.splitTextToSize(businessAnalysisText, pageWidth);
  doc.text(businessAnalysisLines, margin, currentY);
  
  currentY += businessAnalysisLines.length * 5 + 10;
  
  // Add key statistics
  addMetricBox(t('Andel av personalen med hög stressnivå', 'Percentage of staff with high stress levels'), `${data.C7 || '0'}%`);
  addMetricBox(t('Produktionsbortfall vid hög stressnivå', 'Production loss at high stress levels'), `${data.C8 || '0'}%`, pageWidth / 2 - 5);
  
  currentY += 30;
  
  // Add bar chart for stress levels
  addBarChart(t('Andel av personalen med hög stressnivå', 'Percentage of staff with high stress levels'), [
    { label: t('Hög stress', 'High stress'), value: parseFloat(data.C7 || '0') },
    { label: t('Normal stress', 'Normal stress'), value: 100 - parseFloat(data.C7 || '0') }
  ], 100);
  
  // 3. Economic Impact - The Financial Costs of Inaction
  doc.addPage();
  currentY = margin;
  
  addSectionHeader(t('Ekonomiska konsekvenser av psykisk ohälsa', 'Economic Impact of Mental Health Issues'), [220, 230, 240]);
  
  // Add narrative text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const economicImpactText = t(
    `Om inga åtgärder vidtas kommer företaget att förlora cirka ${safeFormatNumber(data.C20)} per år på grund av psykisk ohälsa. Produktionsbortfall står för ${safeFormatNumber(data.C18)}, medan sjukfrånvarokostnader beräknas uppgå till ${safeFormatNumber(data.C19)}.`,
    `If no action is taken, the company will lose approximately ${safeFormatNumber(data.C20)} per year due to mental health issues. Production loss accounts for ${safeFormatNumber(data.C18)}, while sick leave costs are estimated at ${safeFormatNumber(data.C19)}.`
  );
  
  const economicImpactLines = doc.splitTextToSize(economicImpactText, pageWidth);
  doc.text(economicImpactLines, margin, currentY);
  
  currentY += economicImpactLines.length * 5 + 10;
  
  // Add financial breakdown table
  addTableRow(t('Ekonomisk påverkan', 'Economic Impact'), t('Värde (SEK/år)', 'Value (SEK/year)'), true);
  addTableRow(t('Produktionsbortfall', 'Production Loss'), safeFormatNumber(data.C18));
  addTableRow(t('Korttidssjukfrånvaro', 'Short-term Sick Leave'), safeFormatNumber(data.C13));
  addTableRow(t('Långtidssjukfrånvaro', 'Long-term Sick Leave'), safeFormatNumber(data.C16));
  addTableRow(t('Totalt', 'Total'), safeFormatNumber(data.C20), false, true);
  
  currentY += 10;
  
  // Add pie chart for cost breakdown
  const productionLoss = parseFloat(data.C18 || '0');
  const shortTermSickLeave = parseFloat(data.C13 || '0');
  const longTermSickLeave = parseFloat(data.C16 || '0');
  
  // Use the alternative implementation that's more reliable
  addPieChartAsTable(t('Fördelning av kostnader', 'Cost Distribution'), [
    { label: t('Produktionsbortfall', 'Production Loss'), value: productionLoss, color: [100, 150, 200] },
    { label: t('Korttidssjukfrånvaro', 'Short-term Sick Leave'), value: shortTermSickLeave, color: [150, 200, 100] },
    { label: t('Långtidssjukfrånvaro', 'Long-term Sick Leave'), value: longTermSickLeave, color: [200, 100, 150] }
  ]);
  
  // 4. Recommended Interventions & Strategy
  doc.addPage();
  currentY = margin;
  
  addSectionHeader(t('Föreslagna insatser och förväntad effekt', 'Recommended Interventions and Expected Effect'), [220, 230, 240]);
  
  // Add narrative text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const interventionsText = t(
    `För att adressera dessa utmaningar har företaget valt att implementera ${data.B3 || 'insatser'} som första åtgärd. ${data.B5 || 'Syftet är att identifiera anställda med hög stressnivå och vidta åtgärder för att minska risken för sjukskrivning och utbrändhet.'} ${data.B8 || ''}`,
    `To address these challenges, the company has chosen to implement ${data.B3 || 'interventions'} as a first measure. ${data.B5 || 'The purpose is to identify employees with high stress levels and take measures to reduce the risk of sick leave and burnout.'} ${data.B8 || ''}`
  );
  
  const interventionsLines = doc.splitTextToSize(interventionsText, pageWidth);
  doc.text(interventionsLines, margin, currentY);
  
  currentY += interventionsLines.length * 5 + 10;
  
  // Add intervention table
  addTableRow(t('Insats', 'Intervention'), t('Detaljer', 'Details'), true);
  addTableRow(t('Insatsnamn', 'Intervention Name'), data.B3 || t('Ej angivet', 'Not specified'));
  addTableRow(t('Syfte', 'Purpose'), data.B5 || t('Ej angivet', 'Not specified'));
  addTableRow(t('Förväntad effekt', 'Expected Effect'), t(`Sänkt stressnivå med ${data.J6 || '0'}%`, `Reduced stress level by ${data.J6 || '0'}%`));
  addTableRow(t('Kostnad (SEK)', 'Cost (SEK)'), safeFormatNumber(data.G34 || data.G34_total));
  
  // 5. Financial Return - ROI Analysis
  doc.addPage();
  currentY = margin;
  
  addSectionHeader(t('Förväntad ekonomisk nytta och ROI', 'Expected Economic Benefit and ROI'), [220, 230, 240]);
  
  // Add narrative text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const roiText = t(
    `Genom att investera ${safeFormatNumber(data.G34 || data.G34_total)} i stressförebyggande åtgärder förväntas företaget minska sjukskrivningskostnaderna och produktionsbortfallet avsevärt. Beräkningarna visar att den förväntade ekonomiska nyttan är ${safeFormatNumber(data.J7)} per år, vilket resulterar i en ROI på ${data.J11 || '0'}%.`,
    `By investing ${safeFormatNumber(data.G34 || data.G34_total)} in stress prevention measures, the company is expected to significantly reduce sick leave costs and production losses. Calculations show that the expected economic benefit is ${safeFormatNumber(data.J7)} per year, resulting in an ROI of ${data.J11 || '0'}%.`
  );
  
  const roiLines = doc.splitTextToSize(roiText, pageWidth);
  doc.text(roiLines, margin, currentY);
  
  currentY += roiLines.length * 5 + 10;
  
  // Add financial impact summary
  addTableRow(t('Nyckeltal', 'Key Metrics'), t('Värde', 'Value'), true);
  addTableRow(t('Total investering', 'Total Investment'), safeFormatNumber(data.G34 || data.G34_total));
  addTableRow(t('Förväntad besparing', 'Expected Savings'), safeFormatNumber(data.J7));
  addTableRow(t('ROI (%)', 'ROI (%)'), `${data.J11 || '0'}%`);
  addTableRow(t('Break-even nivå (%)', 'Break-even Level (%)'), `${data.J17 || '0'}%`);
  
  currentY += 10;
  
  // Add bar chart for ROI
  addBarChart(t('Investering vs. Förväntad nytta', 'Investment vs. Expected Benefit'), [
    { label: t('Investering', 'Investment'), value: parseFloat(data.G34 || data.G34_total || '0') },
    { label: t('Förväntad nytta (år 1)', 'Expected Benefit (Year 1)'), value: parseFloat(data.J7 || '0') }
  ], Math.max(parseFloat(data.G34 || data.G34_total || '0'), parseFloat(data.J7 || '0')) * 1.2);
  
  // 6. Conclusion & Next Steps
  doc.addPage();
  currentY = margin;
  
  addSectionHeader(t('Slutsats och nästa steg', 'Conclusion and Next Steps'), [220, 230, 240]);
  
  // Add narrative text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const conclusionText = t(
    `Denna rapport visar att psykisk ohälsa har en betydande ekonomisk påverkan på företaget, men att strategiska insatser kan minska dessa kostnader och förbättra arbetsmiljön. Vi rekommenderar att ${data.B3 || 'insatsen'} genomförs inom nästa 3 månader, med en uppföljande analys efter 12 månader.`,
    `This report shows that mental health issues have a significant economic impact on the company, but strategic interventions can reduce these costs and improve the work environment. We recommend that ${data.B3 || 'the intervention'} be implemented within the next 3 months, with a follow-up analysis after 12 months.`
  );
  
  const conclusionLines = doc.splitTextToSize(conclusionText, pageWidth);
  doc.text(conclusionLines, margin, currentY);
  
  currentY += conclusionLines.length * 5 + 10;
  
  // Add action plan table
  addTableRow(t('Åtgärd', 'Action'), t('Tidsplan', 'Timeline'), true);
  addTableRow(t(`Implementera ${data.B3 || 'insats'}`, `Implement ${data.B3 || 'intervention'}`), t('Nästa 3 mån', 'Next 3 months'));
  addTableRow(t('Analysera resultat', 'Analyze results'), t('12 mån efter start', '12 months after start'));
  addTableRow(t('Justera åtgärdsplan', 'Adjust action plan'), t('Baserat på resultat', 'Based on results'));
  
  // Add a footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(t(`Sida ${i} av ${pageCount}`, `Page ${i} of ${pageCount}`), doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text(t('Genererad med SENTION ROI-verktyg', 'Generated with SENTION ROI tool'), doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
  }
  
  // Function to add an appendix section with all form data
  const addAppendixSection = () => {
    // Add a page break before the appendix
    doc.addPage();
    
    // Add appendix title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(t('Appendix - Ifyllda formulär', 'Appendix - Completed Forms'), margin, margin + 10);
    
    // Reset current Y position
    currentY = margin + 20;
    
    // Add Form A appendix
    addSectionHeader(t('Formulär A - Verksamhetsanalys', 'Form A - Business Analysis'), [220, 230, 240]);
    
    // Function to add a form field with label and value in a table-like format
    const addFormField = (label: string, value: string, isSubfield = false) => {
      // Calculate available widths for text
      const labelWidth = pageWidth * 0.4 - 10; // Label column width with padding
      const valueWidth = pageWidth * 0.6 - 10; // Value column width with padding
      
      // Split text to fit within column widths
      const labelLines = doc.splitTextToSize(label, labelWidth);
      const valueLines = doc.splitTextToSize(value, valueWidth);
      
      // Calculate required height based on number of lines
      const lineHeight = 5;
      const labelLinesCount = labelLines.length;
      const valueLinesCount = valueLines.length;
      const rowHeight = Math.max(labelLinesCount, valueLinesCount) * lineHeight + 6;
      
      // Check if we need to add a page break
      if (currentY + rowHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        currentY = margin + 10;
      }
      
      // Draw row background
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(margin, currentY, pageWidth, rowHeight, 'F');
      
      // Draw row border
      doc.setDrawColor(200, 200, 200); // Light gray border
      doc.rect(margin, currentY, pageWidth, rowHeight, 'S');
      
      // Draw vertical line between label and value
      doc.line(margin + pageWidth * 0.4, currentY, margin + pageWidth * 0.4, currentY + rowHeight);
      
      // Set text properties
    doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Add label text
      doc.setFont('helvetica', isSubfield ? 'normal' : 'bold');
      const labelX = isSubfield ? margin + 8 : margin + 5;
      doc.text(labelLines, labelX, currentY + 5);
      
      // Add value text
    doc.setFont('helvetica', 'normal');
      doc.text(valueLines, margin + pageWidth * 0.4 + 5, currentY + 5);
      
      // Update current Y position
      currentY += rowHeight;
    };
    
    // Basic Information
    addFormField(t('A1. Organisationens namn:', 'A1. Organization name:'), data.A1 || t('Ej angivet', 'Not specified'));
    addFormField(t('A2. Kontaktperson:', 'A2. Contact person:'), data.A2 || t('Ej angivet', 'Not specified'));
    
    // Step 1
    addSectionHeader(t('Steg 1 - Definition av verksamheten', 'Step 1 - Definition of the business'), [240, 240, 240]);
    addFormField(t('A3. Definition av verksamheten:', 'A3. Definition of the business:'), data.A3 || t('Ej angivet', 'Not specified'));
    
    // Step 2
    addSectionHeader(t('Steg 2 - Nulägesbeskrivning, psykisk hälsa', 'Step 2 - Current situation description, mental health'), [240, 240, 240]);
    addFormField(t('A4. Nulägesbeskrivning:', 'A4. Current situation description:'), data.A4_description || t('Ej angivet', 'Not specified'));
    addFormField(t('Andel av personalen med hög stressnivå:', 'Proportion of staff with high stress level:'), `${data.A4_stress_percentage || '0'}%`, true);
    addFormField(t('Värde av produktionsbortfall:', 'Value of production loss:'), `${data.A4_production_loss || '0'} ${t('kr', 'SEK')}`, true);
    addFormField(t('Kostnad för sjukfrånvaro beroende på psykisk ohälsa:', 'Cost of sick leave due to mental illness:'), `${data.A4_sick_leave_cost || '0'} ${t('kr', 'SEK')}`, true);
    
    // Step 3
    addSectionHeader(t('Steg 3 - Orsaksanalys och riskbedömning', 'Step 3 - Cause analysis and risk assessment'), [240, 240, 240]);
    addFormField(t('A5. Orsaksanalys och riskbedömning:', 'A5. Cause analysis and risk assessment:'), data.A5 || t('Ej angivet', 'Not specified'));
    
    // Step 4
    addSectionHeader(t('Steg 4 - Målformulering och Behovsanalys', 'Step 4 - Goal formulation and Needs analysis'), [240, 240, 240]);
    addFormField(t('A6. Målformulering och Behovsanalys:', 'A6. Goal formulation and Needs analysis:'), data.A6 || t('Ej angivet', 'Not specified'));
    
    // Step 5
    addSectionHeader(t('Steg 5 - Val av lämpliga insatser', 'Step 5 - Selection of appropriate interventions'), [240, 240, 240]);
    addFormField(t('A7. Val av lämpliga insatser:', 'A7. Selection of appropriate interventions:'), data.A7 || t('Ej angivet', 'Not specified'));
    
    // Step 6
    addSectionHeader(t('Steg 6 - Ekonomiskt beslutsunderlag', 'Step 6 - Economic decision basis'), [240, 240, 240]);
    addFormField(t('A8. Ekonomiskt beslutsunderlag:', 'A8. Economic decision basis:'), data.A8 || t('Ej angivet', 'Not specified'));
    
    // Step 7
    addSectionHeader(t('Steg 7 - Rekommendation för beslut', 'Step 7 - Recommendation for decision'), [240, 240, 240]);
    addFormField(t('A9. Rekommendation för beslut:', 'A9. Recommendation for decision:'), data.A9 || t('Ej angivet', 'Not specified'));
    
    // Check if we need to add Form B
    if (data.B3 || data.B4 || data.B5) {
      // Add a page break
      doc.addPage();
      currentY = margin + 10;
      
      // Add Form B appendix
      addSectionHeader(t('Formulär B - Verksamhetsanalys - insats', 'Form B - Business Analysis - intervention'), [220, 230, 240]);
      
      // Basic Information
      addFormField(t('B1. Organisationens namn:', 'B1. Organization name:'), data.A1 || t('Ej angivet', 'Not specified'));
      addFormField(t('B2. Kontaktperson:', 'B2. Contact person:'), data.A2 || t('Ej angivet', 'Not specified'));
      
      // Intervention Name
      addSectionHeader(t('Insatsnamn', 'Intervention Name'), [240, 240, 240]);
      addFormField(t('B3. Insatsnamn:', 'B3. Intervention name:'), data.B3 || t('Ej angivet', 'Not specified'));
      
      // Intervention Description
      addSectionHeader(t('Vilka insatser avses', 'Which interventions are intended'), [240, 240, 240]);
      addFormField(t('B4. Vilka insatser avses:', 'B4. Which interventions are intended:'), data.B4 || t('Ej angivet', 'Not specified'));
      
      // Purpose
      addSectionHeader(t('Syfte med insatserna', 'Purpose of the interventions'), [240, 240, 240]);
      addFormField(t('B5. Syfte med insatserna:', 'B5. Purpose of the interventions:'), data.B5 || t('Ej angivet', 'Not specified'));
      
      // Support for Business Goals
      addSectionHeader(t('Stöd för verksamhetens övergripande mål', 'Support for the business\'s overall goals'), [240, 240, 240]);
      addFormField(t('B6. Stöd för verksamhetens övergripande mål:', 'B6. Support for the business\'s overall goals:'), data.B6 || t('Ej angivet', 'Not specified'));
      
      // Alternative Approaches
      addSectionHeader(t('Alternativa ansatser', 'Alternative approaches'), [240, 240, 240]);
      addFormField(t('B7. Alternativa ansatser:', 'B7. Alternative approaches:'), data.B7 || t('Ej angivet', 'Not specified'));
      
      // Goals
      addSectionHeader(t('Mål med insatserna', 'Goals with the interventions'), [240, 240, 240]);
      addFormField(t('B8. Mål med insatserna:', 'B8. Goals with the interventions:'), data.B8 || t('Ej angivet', 'Not specified'));
      
      // Target Group
      addSectionHeader(t('Målgrupp', 'Target group'), [240, 240, 240]);
      addFormField(t('B9. Målgrupp:', 'B9. Target group:'), data.B9 || t('Ej angivet', 'Not specified'));
      
      // Expected Effect Timeline
      addSectionHeader(t('När nås förväntad effekt av insatsen', 'When is the expected effect of the intervention reached'), [240, 240, 240]);
      addFormField(t('B10. När nås förväntad effekt av insatsen:', 'B10. When is the expected effect of the intervention reached:'), data.B10 || t('Ej angivet', 'Not specified'));
      
      // Implementation Plan
      addSectionHeader(t('Genomförandeplan', 'Implementation plan'), [240, 240, 240]);
      addFormField(t('B11. Genomförandeplan:', 'B11. Implementation plan:'), data.B11 || t('Ej angivet', 'Not specified'));
    }
    
    // Add more forms (C, D, E, etc.) as needed following the same pattern
    
    // Check if we need to add Form C
    if (data.C7 || data.C8 || data.C20) {
      // Add a page break
      doc.addPage();
      currentY = margin + 10;
      
      // Add Form C appendix
      addSectionHeader(t('Formulär C - Beräkningsmodell för ekonomiska konsekvenser', 'Form C - Economic Impact Calculation Model'), [220, 230, 240]);
      
      // Basic Information
      addFormField(t('C1. Organisationens namn:', 'C1. Organization name:'), data.A1 || t('Ej angivet', 'Not specified'));
      addFormField(t('C2. Kontaktperson:', 'C2. Contact person:'), data.A2 || t('Ej angivet', 'Not specified'));
      
      // Time period
      const timeperiod = data.G3_start && data.G3_end 
        ? `${data.G3_start} - ${data.G3_end}` 
        : t('Ej angivet', 'Not specified');
      addFormField(t('C3. Tidsperiod (12 månader):', 'C3. Time period (12 months):'), timeperiod);
      
      // Beräkning av kostnad för produktionsbortfall pga psykisk ohälsa
      addSectionHeader(t('Beräkning av kostnad för produktionsbortfall pga psykisk ohälsa', 'Calculation of cost for production loss due to mental illness'), [240, 240, 240]);
      
      addFormField(t('C4. Totala personalkostnader (lön + sociala + kringkostnader), kr per år:', 'C4. Total personnel costs (salary + social + overhead), SEK per year:'), 
        `${formatNumber(data.D9 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('C5. Vinst i företaget, kr per år:', 'C5. Company profit, SEK per year:'), 
        `${formatNumber(data.C5 || '0')} ${t('kr', 'SEK')}`);
        
      const totalValueOfWork = data.D9 && data.C5 
        ? (parseFloat(data.D9) + parseFloat(data.C5)).toFixed(0) 
        : data.D9 || '0';
        
      addFormField(t('C6. Summa, värde av arbete:', 'C6. Sum, value of work:'), 
        `${formatNumber(totalValueOfWork)} ${t('kr', 'SEK')}`);
      addFormField(t('C7. Andel av personalen med hög stressnivå (%):', 'C7. Proportion of staff with high stress level (%):'), 
        `${data.C7 || '0'} %`);
      addFormField(t('C8. Produktionsbortfall vid hög stressnivå (%):', 'C8. Production loss at high stress level (%):'), 
        `${data.C8 || '0'} %`);
        
      const totalProductionLoss = data.C7 && data.C8 
        ? ((parseFloat(data.C7) / 100) * (parseFloat(data.C8) / 100) * 100).toFixed(1) 
        : '0';
        
      addFormField(t('C9. Totalt produktionsbortfall:', 'C9. Total production loss:'), 
        `${totalProductionLoss} %`);
      addFormField(t('C10. Värde av produktionsbortfall (för över till ruta C18):', 'C10. Value of production loss (transfer to box C18):'), 
        `${formatNumber(data.C18 || '0')} ${t('kr', 'SEK')}`);
      
      // Beräkning av kostnad för sjukfrånvaro pga psykisk ohälsa
      addSectionHeader(t('Beräkning av kostnad för sjukfrånvaro pga psykisk ohälsa', 'Calculation of cost for sick leave due to mental illness'), [240, 240, 240]);
      
      addFormField(t('C11. Total kostnad för kort sjukfrånvaro (dag 1-14), kr per år:', 'C11. Total cost of short-term sick leave (day 1-14), SEK per year:'), 
        `${formatNumber(data.E8 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('C12. Andel av kort sjukfrånvaro som beror på psykisk ohälsa:', 'C12. Proportion of short-term sick leave due to mental illness:'), 
        `${data.C12 || '0'} %`);
        
      const shortTermSickLeaveCost = data.E8 && data.C12 
        ? (parseFloat(data.E8) * parseFloat(data.C12) / 100).toFixed(0) 
        : '0';
        
      addFormField(t('C13. Kostnad för kort sjukfrånvaro beroende på psykisk ohälsa, kr per år:', 'C13. Cost of short-term sick leave due to mental illness, SEK per year:'), 
        `${formatNumber(shortTermSickLeaveCost)} ${t('kr', 'SEK')}`);
      addFormField(t('C14. Total kostnad för lång sjukfrånvaro (dag 15--), kr per år:', 'C14. Total cost of long-term sick leave (day 15--), SEK per year:'), 
        `${formatNumber(data.F8 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('C15. Andel av lång sjukfrånvaro som beror på psykisk ohälsa:', 'C15. Proportion of long-term sick leave due to mental illness:'), 
        `${data.C15 || '0'} %`);
        
      const longTermSickLeaveCost = data.F8 && data.C15 
        ? (parseFloat(data.F8) * parseFloat(data.C15) / 100).toFixed(0) 
        : '0';
        
      addFormField(t('C16. Kostnad för lång sjukfrånvaro beroende på psykisk ohälsa, kr per år:', 'C16. Cost of long-term sick leave due to mental illness, SEK per year:'), 
        `${formatNumber(longTermSickLeaveCost)} ${t('kr', 'SEK')}`);
      addFormField(t('C17. Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år:', 'C17. Cost of sick leave due to mental illness, SEK per year:'), 
        `${formatNumber(data.C19 || '0')} ${t('kr', 'SEK')}`);
      
      // Summering av kostnad pga psykisk ohälsa
      addSectionHeader(t('Summering av kostnad pga psykisk ohälsa', 'Summary of cost due to mental illness'), [240, 240, 240]);
      
      addFormField(t('C18. Värde av produktionsbortfall, kr per år:', 'C18. Value of production loss, SEK per year:'), 
        `${formatNumber(data.C18 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('C19. Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år:', 'C19. Cost of sick leave due to mental illness, SEK per year:'), 
        `${formatNumber(data.C19 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('C20. Total kostnad för psykisk ohälsa, kr per år:', 'C20. Total cost of mental illness, SEK per year:'), 
        `${formatNumber(data.C20 || '0')} ${t('kr', 'SEK')}`, true);
    }
    
    // Check if we need to add Form D
    if (data.D1 || data.D4 || data.D9) {
      // Add a page break
      doc.addPage();
      currentY = margin + 10;
      
      // Add Form D appendix
      addSectionHeader(t('Formulär D - Beräkning av personalkostnader', 'Form D - Calculation of Personnel Costs'), [220, 230, 240]);
      
      // Basic Information
      addFormField(t('D1. Genomsnittlig månadslön:', 'D1. Average monthly salary:'), 
        `${formatNumber(data.D1 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('D2. Sociala avgifter inkl arb.givaravgift, tjänstepension och försäkringar (%):', 'D2. Social security contributions incl. employer\'s contribution, occupational pension and insurance (%):'), 
        `${data.D2 || '0'} %`);
        
      const socialSecurityContributions = data.D1 && data.D2 
        ? (parseFloat(data.D1) * parseFloat(data.D2) / 100).toFixed(0) 
        : '0';
        
      addFormField(t('D3. Genomsnittliga sociala avgifter per månad:', 'D3. Average social security contributions per month:'), 
        `${formatNumber(socialSecurityContributions)} ${t('kr', 'SEK')}`);
      
      // Beräkning av lönekostnader
      addSectionHeader(t('Beräkning av lönekostnader', 'Calculation of salary costs'), [240, 240, 240]);
      
      addFormField(t('D4. Antal anställda (motsvarande heltidstjänster/FTE):', 'D4. Number of employees (equivalent to full-time positions/FTE):'), 
        formatNumber(data.D4 || '0'));
      addFormField(t('D5. Antal månader som beräkningen avser:', 'D5. Number of months that the calculation refers to:'), 
        data.D5 || '0');
        
      const totalSalaryCosts = data.D1 && data.D4 && data.D5 
        ? (parseFloat(data.D1) * parseFloat(data.D4) * parseFloat(data.D5)).toFixed(0) 
        : '0';
        
      addFormField(t('D6. Totala lönekostnader, kr:', 'D6. Total salary costs, SEK:'), 
        `${formatNumber(totalSalaryCosts)} ${t('kr', 'SEK')}`);
      
      // Beräkning av personalkringkostnader
      addSectionHeader(t('Beräkning av personalkringkostnader', 'Calculation of personnel overhead costs'), [240, 240, 240]);
      
      addFormField(t('D7. Personalkringkostnader i % av lönekostnader:', 'D7. Personnel overhead costs as % of salary costs:'), 
        `${data.D7 || '0'} %`);
        
      const totalOverheadCosts = data.D6 && data.D7 
        ? (parseFloat(data.D6) * parseFloat(data.D7) / 100).toFixed(0) 
        : '0';
        
      addFormField(t('D8. Totala personalkringkostnader, kr:', 'D8. Total personnel overhead costs, SEK:'), 
        `${formatNumber(totalOverheadCosts)} ${t('kr', 'SEK')}`);
      
      // Summering
      addSectionHeader(t('Summering', 'Summary'), [240, 240, 240]);
      
      addFormField(t('D9. Totala personalkostnader, kr. Överförs till C4:', 'D9. Total personnel costs, SEK. Transferred to C4:'), 
        `${formatNumber(data.D9 || '0')} ${t('kr', 'SEK')}`, true);
      
      // Beräkning av personalkostnad per arbetad timme
      addSectionHeader(t('Beräkning av personalkostnad per arbetad timme', 'Calculation of personnel cost per worked hour'), [240, 240, 240]);
      
      addFormField(t('D10. Schemalagd arbetstid (timmar) per år:', 'D10. Scheduled working hours per year:'), 
        formatNumber(data.D10 || '0'));
        
      const costPerHour = data.D9 && data.D10 && data.D4 
        ? (parseFloat(data.D9) / (parseFloat(data.D10) * parseFloat(data.D4))).toFixed(0) 
        : '0';
        
      addFormField(t('D11. Personalkostnad kr. per arbetad timme.', 'D11. Personnel cost SEK. per worked hour.'), 
        `${formatNumber(costPerHour)} ${t('kr', 'SEK')}`, true);
    }
    
    // Check if we need to add Form E
    if (data.E1 || data.E4 || data.E8) {
      // Add a page break
      doc.addPage();
      currentY = margin + 10;
      
      // Add Form E appendix
      addSectionHeader(t('Formulär E - Beräkning av kostnader för kort sjukfrånvaro (dag 1–14)', 'Form E - Calculation of costs for short-term sick leave (day 1-14)'), [220, 230, 240]);
      
      // Basic Information
      addFormField(t('E1. Genomsnittlig månadslön:', 'E1. Average monthly salary:'), 
        `${formatNumber(data.E1 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('E2. Kostnad för kort sjukfrånvaro per sjukdag % av månadslön:', 'E2. Cost for short-term sick leave per sick day % of monthly salary:'), 
        `${data.E2 || '0'} %`);
        
      const costPerSickDay = data.E1 && data.E2 
        ? (parseFloat(data.E1) * parseFloat(data.E2) / 100).toFixed(0) 
        : '0';
        
      addFormField(t('E3. Kostnad för kort sjukfrånvaro per sjukdag, kr:', 'E3. Cost for short-term sick leave per sick day, SEK:'), 
        `${formatNumber(costPerSickDay)} ${t('kr', 'SEK')}`);
      
      // Beräkning av antal sjukdagar
      addSectionHeader(t('Beräkning av antal sjukdagar', 'Calculation of number of sick days'), [240, 240, 240]);
      
      addFormField(t('E4. Antal anställda (motsvarande heltidstjänster/FTE):', 'E4. Number of employees (equivalent to full-time positions/FTE):'), 
        formatNumber(data.E4 || '0'));
      addFormField(t('E5. Antal schemalagda arbetsdagar per år, per anställd:', 'E5. Number of scheduled working days per year, per employee:'), 
        formatNumber(data.E5 || '0'));
      addFormField(t('E6. Sjukfrånvaro, kort (dag 1-14) i % av schemalagd arbetstid:', 'E6. Sick leave, short (day 1-14) in % of scheduled working time:'), 
        `${data.E6 || '0'} %`);
        
      const totalSickDays = data.E4 && data.E5 && data.E6 
        ? (parseFloat(data.E4) * parseFloat(data.E5) * parseFloat(data.E6) / 100).toFixed(0) 
        : '0';
        
      addFormField(t('E7. Antal sjukdagar totalt (kort sjukfrånvaro):', 'E7. Total number of sick days (short-term sick leave):'), 
        formatNumber(totalSickDays));
      
      // Summering
      addSectionHeader(t('Summering', 'Summary'), [240, 240, 240]);
      
      addFormField(t('E8. Totala kostnader, kort sjukfrånvaro, överförs till C11:', 'E8. Total costs, short-term sick leave, transferred to C11:'), 
        `${formatNumber(data.E8 || '0')} ${t('kr', 'SEK')}`, true);
    }
    
    // Check if we need to add Form F
    if (data.F1 || data.F4 || data.F8) {
      // Add a page break
      doc.addPage();
      currentY = margin + 10;
      
      // Add Form F appendix
      addSectionHeader(t('Formulär F - Beräkning av kostnader för lång sjukfrånvaro (dag 15 och framåt)', 'Form F - Calculation of costs for long-term sick leave (day 15 and onwards)'), [220, 230, 240]);
      
      // Basic Information
      addFormField(t('F1. Genomsnittlig månadslön:', 'F1. Average monthly salary:'), 
        `${formatNumber(data.F1 || '0')} ${t('kr', 'SEK')}`);
      addFormField(t('F2. Kostnad för lång sjukfrånvaro per sjukdag i % av månadslön:', 'F2. Cost for long-term sick leave per sick day % of monthly salary:'), 
        `${data.F2 || '0'} %`);
          
      const costPerSickDay = data.F1 && data.F2 
        ? (parseFloat(data.F1) * parseFloat(data.F2) / 100).toFixed(0) 
        : '0';
          
      addFormField(t('F3. Kostnad för lång sjukfrånvaro per sjukdag, kr:', 'F3. Cost for long-term sick leave per sick day, SEK:'), 
        `${formatNumber(costPerSickDay)} ${t('kr', 'SEK')}`);
        
      // Beräkning av antal sjukdagar
      addSectionHeader(t('Beräkning av antal sjukdagar', 'Calculation of number of sick days'), [240, 240, 240]);
        
      addFormField(t('F4. Antal anställda (motsvarande heltidstjänster/FTE):', 'F4. Number of employees (equivalent to full-time positions/FTE):'), 
        formatNumber(data.F4 || '0'));
      addFormField(t('F5. Antal schemalagda arbetsdagar per år, per anställd:', 'F5. Number of scheduled working days per year, per employee:'), 
        formatNumber(data.F5 || '0'));
      addFormField(t('F6. Sjukfrånvaro, lång (dag 15 och framåt) i % av schemalagd arbetstid:', 'F6. Sick leave, long (day 15 and onwards) in % of scheduled working time:'), 
        `${data.F6 || '0'} %`);
          
      const totalSickDays = data.F4 && data.F5 && data.F6 
        ? (parseFloat(data.F4) * parseFloat(data.F5) * parseFloat(data.F6) / 100).toFixed(0) 
        : '0';
          
      addFormField(t('F7. Antal sjukdagar totalt (lång sjukfrånvaro):', 'F7. Total number of sick days (long-term sick leave):'), 
        formatNumber(totalSickDays));
        
      // Summering
      addSectionHeader(t('Summering', 'Summary'), [240, 240, 240]);
        
      addFormField(t('F8. Totala kostnader, lång sjukfrånvaro, överförs till C14:', 'F8. Total costs, long-term sick leave, transferred to C14:'), 
        `${formatNumber(data.F8 || '0')} ${t('kr', 'SEK')}`, true);
    }
    
    // Check if we need to add Form G
    if (data.G1 || data.G4_name || data.G34_total) {
      // Add a page break
        doc.addPage();
      currentY = margin + 10;
      
      // Add Form G appendix
      addSectionHeader(t('Formulär G - Kostnader för insatser', 'Form G - Costs for interventions'), [220, 230, 240]);
      
      // Basic Information
      addFormField(t('G1. Organisationens namn:', 'G1. Organization name:'), 
        data.G1 || t('Ej angivet', 'Not specified'));
      addFormField(t('G2. Kontaktperson:', 'G2. Contact person:'), 
        data.G2 || t('Ej angivet', 'Not specified'));
      addFormField(t('G3. Tidsperiod (12 månader):', 'G3. Time period (12 months):'), 
        `${data.G3_start || t('Ej angivet', 'Not specified')} - ${data.G3_end || t('Ej angivet', 'Not specified')}`);
      
      // Insats 1
      addSectionHeader(t('Insats 1', 'Intervention 1'), [240, 240, 240]);
      addFormField(t('G4. Insatsnamn:', 'G4. Intervention name:'), data.G4_name || t('Ej angivet', 'Not specified'));
      addFormField(t('G5. Delinsats 1.1:', 'G5. Sub-intervention 1.1:'), data.G5_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G5_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G5_internal), true);
      addFormField(t('G6. Delinsats 1.2:', 'G6. Sub-intervention 1.2:'), data.G6_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G6_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G6_internal), true);
      addFormField(t('G7. Delinsats 1.3:', 'G7. Sub-intervention 1.3:'), data.G7_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G7_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G7_internal), true);
      addFormField(t('G8. Delinsats 1.4:', 'G8. Sub-intervention 1.4:'), data.G8_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G8_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G8_internal), true);
      addFormField(t('G9. Delsumma 1:', 'G9. Subtotal 1:'), safeFormatNumber(data.G9_total), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G9_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G9_internal), true);
      
      // Insats 2
      addSectionHeader(t('Insats 2', 'Intervention 2'), [240, 240, 240]);
      addFormField(t('G10. Insatsnamn:', 'G10. Intervention name:'), data.G10_name || t('Ej angivet', 'Not specified'));
      addFormField(t('G11. Delinsats 2.1:', 'G11. Sub-intervention 2.1:'), data.G11_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G11_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G11_internal), true);
      addFormField(t('G12. Delinsats 2.2:', 'G12. Sub-intervention 2.2:'), data.G12_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G12_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G12_internal), true);
      addFormField(t('G13. Delinsats 2.3:', 'G13. Sub-intervention 2.3:'), data.G13_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G13_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G13_internal), true);
      addFormField(t('G14. Delinsats 2.4:', 'G14. Sub-intervention 2.4:'), data.G14_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G14_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G14_internal), true);
      addFormField(t('G15. Delsumma 2:', 'G15. Subtotal 2:'), safeFormatNumber(data.G15_total), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G15_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G15_internal), true);
      
      // Insats 3
      addSectionHeader(t('Insats 3', 'Intervention 3'), [240, 240, 240]);
      addFormField(t('G16. Insatsnamn:', 'G16. Intervention name:'), data.G16_name || t('Ej angivet', 'Not specified'));
      addFormField(t('G17. Delinsats 3.1:', 'G17. Sub-intervention 3.1:'), data.G17_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G17_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G17_internal), true);
      addFormField(t('G18. Delinsats 3.2:', 'G18. Sub-intervention 3.2:'), data.G18_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G18_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G18_internal), true);
      addFormField(t('G19. Delinsats 3.3:', 'G19. Sub-intervention 3.3:'), data.G19_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G19_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G19_internal), true);
      addFormField(t('G20. Delinsats 3.4:', 'G20. Sub-intervention 3.4:'), data.G20_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G20_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G20_internal), true);
      addFormField(t('G21. Delsumma 3:', 'G21. Subtotal 3:'), safeFormatNumber(data.G21_total), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G21_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G21_internal), true);
      
      // Insats 4
      addSectionHeader(t('Insats 4', 'Intervention 4'), [240, 240, 240]);
      addFormField(t('G22. Insatsnamn:', 'G22. Intervention name:'), data.G22_name || t('Ej angivet', 'Not specified'));
      addFormField(t('G23. Delinsats 4.1:', 'G23. Sub-intervention 4.1:'), data.G23_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G23_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G23_internal), true);
      addFormField(t('G24. Delinsats 4.2:', 'G24. Sub-intervention 4.2:'), data.G24_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G24_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G24_internal), true);
      addFormField(t('G25. Delinsats 4.3:', 'G25. Sub-intervention 4.3:'), data.G25_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G25_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G25_internal), true);
      addFormField(t('G26. Delinsats 4.4:', 'G26. Sub-intervention 4.4:'), data.G26_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G26_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G26_internal), true);
      addFormField(t('G27. Delsumma 4:', 'G27. Subtotal 4:'), safeFormatNumber(data.G27_total), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G27_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G27_internal), true);
      
      // Insats 5
      addSectionHeader(t('Insats 5', 'Intervention 5'), [240, 240, 240]);
      addFormField(t('G28. Insatsnamn:', 'G28. Intervention name:'), data.G28_name || t('Ej angivet', 'Not specified'));
      addFormField(t('G29. Delinsats 5.1:', 'G29. Sub-intervention 5.1:'), data.G29_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G29_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G29_internal), true);
      addFormField(t('G30. Delinsats 5.2:', 'G30. Sub-intervention 5.2:'), data.G30_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G30_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G30_internal), true);
      addFormField(t('G31. Delinsats 5.3:', 'G31. Sub-intervention 5.3:'), data.G31_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G31_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G31_internal), true);
      addFormField(t('G32. Delinsats 5.4:', 'G32. Sub-intervention 5.4:'), data.G32_name || t('Ej angivet', 'Not specified'), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G32_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G32_internal), true);
      addFormField(t('G33. Delsumma 5:', 'G33. Subtotal 5:'), safeFormatNumber(data.G33_total), true);
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G33_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G33_internal), true);
      
      // Total for all interventions
      addFormField(t('G34. TOTALT ALLA INSATSER:', 'G34. TOTAL ALL INTERVENTIONS:'), safeFormatNumber(data.G34_total));
      addFormField(t('Externa kostnader:', 'External costs:'), safeFormatNumber(data.G34_external), true);
      addFormField(t('Interna kostnader:', 'Internal costs:'), safeFormatNumber(data.G34_internal), true);
    }
  };
  
  // Add the appendix section to the report
  addAppendixSection();
  
  // Return the PDF document
  return doc;
}

// Function to fetch data for the report
export async function fetchReportData(): Promise<FormAData> {
  try {
    // Fetch data from all forms
    const formA = await getFormByFormId('form-a');
    const formB = await getFormByFormId('form-b');
    const formC = await getFormByFormId('form-c');
    const formD = await getFormByFormId('form-d');
    const formE = await getFormByFormId('form-e');
    const formF = await getFormByFormId('form-f');
    const formG = await getFormByFormId('form-g');
    const formH = await getFormByFormId('form-h');
    const formI = await getFormByFormId('form-i');
    const formJ = await getFormByFormId('form-j');
    
    // Combine data from all forms
    const formAData = formA?.data || {};
    const formBData = formB?.data || {};
    const formCData = formC?.data || {};
    const formDData = formD?.data || {};
    const formEData = formE?.data || {};
    const formFData = formF?.data || {};
    const formGData = formG?.data || {};
    const formHData = formH?.data || {};
    const formIData = formI?.data || {};
    const formJData = formJ?.data || {};
    
    // Create a combined data object with all form data
    const allFormData = {
      ...formAData,
      ...formBData,
      ...formCData,
      ...formDData,
      ...formEData,
      ...formFData,
      ...formGData,
      ...formHData,
      ...formIData,
      ...formJData,
    };
    
    // Remove duplicate entries
    delete allFormData.A6_goals;
    delete allFormData.A7_interventions;
    
    return {
      // Form A data
      A1: formAData.A1 as string || '',
      A2: formAData.A2 as string || '',
      A3: formAData.A3 as string || '',
      A4: formAData.A4 as string || '',
      A5: formAData.A5 as string || '',
      A6: formAData.A6 as string || '',
      A7: formAData.A7 as string || '',
      A8: formAData.A8 as string || '',
      A9: formAData.A9 as string || '',
      A4_description: formAData.A4_description as string || '',
      A4_stress_percentage: formAData.A4_stress_percentage as string || '',
      A4_production_loss: formAData.A4_production_loss as string || '',
      A4_sick_leave_cost: formAData.A4_sick_leave_cost as string || '',
      
      // Form B data
      B3: formBData.B3 as string || '',
      B4: formBData.B4 as string || '',
      B5: formBData.B5 as string || '',
      B6: formBData.B6 as string || '',
      B7: formBData.B7 as string || '',
      B8: formBData.B8 as string || '',
      B9: formBData.B9 as string || '',
      B10: formBData.B10 as string || '',
      B11: formBData.B11 as string || '',
      
      // Form C data
      C5: formCData.C5 as string || '',
      C7: formCData.C7 as string || '',
      C8: formCData.C8 as string || '',
      C12: formCData.C12 as string || '',
      C13: formCData.C13 as string || '',
      C15: formCData.C15 as string || '',
      C16: formCData.C16 as string || '',
      C18: formCData.C18 as string || '',
      C19: formCData.C19 as string || '',
      C20: formCData.C20 as string || '',
      
      // Form D data - explicitly include all fields
      D1: formDData.D1 as string || '',
      D2: formDData.D2 as string || '',
      D3: formDData.D3 as string || '',
      D4: formDData.D4 as string || '',
      D5: formDData.D5 as string || '',
      D6: formDData.D6 as string || '',
      D7: formDData.D7 as string || '',
      D8: formDData.D8 as string || '',
      D9: formDData.D9 as string || '',
      D10: formDData.D10 as string || '',
      D11: formDData.D11 as string || '',
      
      // Form E data - explicitly include all fields
      E1: formEData.E1 as string || '',
      E2: formEData.E2 as string || '',
      E3: formEData.E3 as string || '',
      E4: formEData.E4 as string || '',
      E5: formEData.E5 as string || '',
      E6: formEData.E6 as string || '',
      E7: formEData.E7 as string || '',
      E8: formEData.E8 as string || '',
      
      // Form F data - explicitly include all fields
      F1: formFData.F1 as string || '',
      F2: formFData.F2 as string || '',
      F3: formFData.F3 as string || '',
      F4: formFData.F4 as string || '',
      F5: formFData.F5 as string || '',
      F6: formFData.F6 as string || '',
      F7: formFData.F7 as string || '',
      F8: formFData.F8 as string || '',
      
      // Form G data
      G1: formGData.G1 as string || '',
      G2: formGData.G2 as string || '',
      G3_start: formGData.G3_start as string || '',
      G3_end: formGData.G3_end as string || '',
      
      // Section 1
      G4_name: formGData.G4_name as string || '',
      G5_name: formGData.G5_name as string || '',
      G5_external: formGData.G5_external as string || '',
      G5_internal: formGData.G5_internal as string || '',
      G6_name: formGData.G6_name as string || '',
      G6_external: formGData.G6_external as string || '',
      G6_internal: formGData.G6_internal as string || '',
      G7_name: formGData.G7_name as string || '',
      G7_external: formGData.G7_external as string || '',
      G7_internal: formGData.G7_internal as string || '',
      G8_name: formGData.G8_name as string || '',
      G8_external: formGData.G8_external as string || '',
      G8_internal: formGData.G8_internal as string || '',
      G9_external: formGData.G9_external as string || '',
      G9_internal: formGData.G9_internal as string || '',
      G9_total: formGData.G9_total as string || '',
      
      // Section 2
      G10_name: formGData.G10_name as string || '',
      G11_name: formGData.G11_name as string || '',
      G11_external: formGData.G11_external as string || '',
      G11_internal: formGData.G11_internal as string || '',
      G12_name: formGData.G12_name as string || '',
      G12_external: formGData.G12_external as string || '',
      G12_internal: formGData.G12_internal as string || '',
      G13_name: formGData.G13_name as string || '',
      G13_external: formGData.G13_external as string || '',
      G13_internal: formGData.G13_internal as string || '',
      G14_name: formGData.G14_name as string || '',
      G14_external: formGData.G14_external as string || '',
      G14_internal: formGData.G14_internal as string || '',
      G15_external: formGData.G15_external as string || '',
      G15_internal: formGData.G15_internal as string || '',
      G15_total: formGData.G15_total as string || '',
      
      // Section 3
      G16_name: formGData.G16_name as string || '',
      G17_name: formGData.G17_name as string || '',
      G17_external: formGData.G17_external as string || '',
      G17_internal: formGData.G17_internal as string || '',
      G18_name: formGData.G18_name as string || '',
      G18_external: formGData.G18_external as string || '',
      G18_internal: formGData.G18_internal as string || '',
      G19_name: formGData.G19_name as string || '',
      G19_external: formGData.G19_external as string || '',
      G19_internal: formGData.G19_internal as string || '',
      G20_name: formGData.G20_name as string || '',
      G20_external: formGData.G20_external as string || '',
      G20_internal: formGData.G20_internal as string || '',
      G21_external: formGData.G21_external as string || '',
      G21_internal: formGData.G21_internal as string || '',
      G21_total: formGData.G21_total as string || '',
      
      // Section 4
      G22_name: formGData.G22_name as string || '',
      G23_name: formGData.G23_name as string || '',
      G23_external: formGData.G23_external as string || '',
      G23_internal: formGData.G23_internal as string || '',
      G24_name: formGData.G24_name as string || '',
      G24_external: formGData.G24_external as string || '',
      G24_internal: formGData.G24_internal as string || '',
      G25_name: formGData.G25_name as string || '',
      G25_external: formGData.G25_external as string || '',
      G25_internal: formGData.G25_internal as string || '',
      G26_name: formGData.G26_name as string || '',
      G26_external: formGData.G26_external as string || '',
      G26_internal: formGData.G26_internal as string || '',
      G27_external: formGData.G27_external as string || '',
      G27_internal: formGData.G27_internal as string || '',
      G27_total: formGData.G27_total as string || '',
      
      // Section 5
      G28_name: formGData.G28_name as string || '',
      G29_name: formGData.G29_name as string || '',
      G29_external: formGData.G29_external as string || '',
      G29_internal: formGData.G29_internal as string || '',
      G30_name: formGData.G30_name as string || '',
      G30_external: formGData.G30_external as string || '',
      G30_internal: formGData.G30_internal as string || '',
      G31_name: formGData.G31_name as string || '',
      G31_external: formGData.G31_external as string || '',
      G31_internal: formGData.G31_internal as string || '',
      G32_name: formGData.G32_name as string || '',
      G32_external: formGData.G32_external as string || '',
      G32_internal: formGData.G32_internal as string || '',
      G33_external: formGData.G33_external as string || '',
      G33_internal: formGData.G33_internal as string || '',
      G33_total: formGData.G33_total as string || '',
      
      // Grand Total
      G34: formGData.G34 as string || '',
      G34_external: formGData.G34_external as string || '',
      G34_internal: formGData.G34_internal as string || '',
      G34_total: formGData.G34_total as string || '',
      
      // Form H data
      H1: formHData.H1 as string || '',
      H2: formHData.H2 as string || '',
      
      // Form J data
      J5: formJData.J5 as string || '',
      J6: formJData.J6 as string || '',
      J7: formJData.J7 as string || '',
      J8: formJData.J8 as string || '',
      J9: formJData.J9 as string || '',
      J11: formJData.J11 as string || '',
      J17: formJData.J17 as string || '',
      
      // Include all other form data for the appendix
      ...allFormData
    };
  } catch (error) {
    console.error('Error fetching form data:', error);
    return {
      A1: '',
      A2: '',
      A3: '',
      A4: '',
      A5: '',
      A6: '',
      A7: '',
      A8: '',
      A9: '',
      A4_description: '',
      A4_stress_percentage: '',
      A4_production_loss: '',
      A4_sick_leave_cost: '',
      B3: '',
      B4: '',
      B5: '',
      B6: '',
      B7: '',
      B8: '',
      B9: '',
      B10: '',
      B11: '',
      C5: '', // Added missing C5 property
      C7: '',
      C8: '',
      C12: '',
      C13: '',
      C15: '',
      C16: '',
      C18: '',
      C19: '',
      C20: '',
      D1: '',
      D2: '',
      D3: '',
      D4: '',
      D5: '',
      D6: '',
      D7: '',
      D8: '',
      D9: '',
      D10: '',
      D11: '',
      E1: '',
      E2: '',
      E3: '',
      E4: '',
      E5: '',
      E6: '',
      E7: '',
      E8: '',
      F1: '',
      F2: '',
      F3: '',
      F4: '',
      F5: '',
      F6: '',
      F7: '',
      F8: '',
      G1: '',
      G2: '',
      G3_start: '',
      G3_end: '',
      G4_name: '',
      G5_name: '',
      G5_external: '',
      G5_internal: '',
      G6_name: '',
      G6_external: '',
      G6_internal: '',
      G7_name: '',
      G7_external: '',
      G7_internal: '',
      G8_name: '',
      G8_external: '',
      G8_internal: '',
      G9_external: '',
      G9_internal: '',
      G9_total: '',
      G10_name: '',
      G11_name: '',
      G11_external: '',
      G11_internal: '',
      G12_name: '',
      G12_external: '',
      G12_internal: '',
      G13_name: '',
      G13_external: '',
      G13_internal: '',
      G14_name: '',
      G14_external: '',
      G14_internal: '',
      G15_external: '',
      G15_internal: '',
      G15_total: '',
      G16_name: '',
      G17_name: '',
      G17_external: '',
      G17_internal: '',
      G18_name: '',
      G18_external: '',
      G18_internal: '',
      G19_name: '',
      G19_external: '',
      G19_internal: '',
      G20_name: '',
      G20_external: '',
      G20_internal: '',
      G21_external: '',
      G21_internal: '',
      G21_total: '',
      G22_name: '',
      G23_name: '',
      G23_external: '',
      G23_internal: '',
      G24_name: '',
      G24_external: '',
      G24_internal: '',
      G25_name: '',
      G25_external: '',
      G25_internal: '',
      G26_name: '',
      G26_external: '',
      G26_internal: '',
      G27_external: '',
      G27_internal: '',
      G27_total: '',
      G28_name: '',
      G29_name: '',
      G29_external: '',
      G29_internal: '',
      G30_name: '',
      G30_external: '',
      G30_internal: '',
      G31_name: '',
      G31_external: '',
      G31_internal: '',
      G32_name: '',
      G32_external: '',
      G32_internal: '',
      G33_external: '',
      G33_internal: '',
      G33_total: '',
      G34: '',
      G34_external: '',
      G34_internal: '',
      G34_total: '',
      J5: '',
      J6: '',
      J7: '',
      J8: '',
      J9: '',
      J11: '',
      J17: '',
      H1: '',
      H2: ''
    };
  }
}

// Helper function to format numbers
export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0' : num.toLocaleString('sv-SE');
}
