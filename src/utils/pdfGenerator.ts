import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface StudentAttendanceData {
  name: string;
  email: string;
  stream: string;
  status: 'present' | 'absent' | 'not-marked';
  timeMarked?: string;
  photoUrl?: string;
}

// Function to load image as base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve('');
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = url;
  });
};

export const generateAttendancePDF = async (
  students: StudentAttendanceData[],
  title: string = 'Student Attendance Report',
  onProgress?: (message: string) => void
) => {
  onProgress?.('Generating PDF...');
  
  const doc = new jsPDF('portrait', 'mm', 'a4');
  
  // Add school header image
  const headerImg = new Image();
  headerImg.src = 'https://raw.githubusercontent.com/Fresh-Teacher/glorious-gateway-65056-78561-35497/main/src/assets/header.png';
  
  // Add header image at the top
  const imgWidth = 190;
  const imgHeight = 30;
  doc.addImage(headerImg, 'PNG', 10, 10, imgWidth, imgHeight);
  
  // Add title below header
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 48, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`,
    doc.internal.pageSize.getWidth() / 2,
    55,
    { align: 'center' }
  );
  
  // Add summary
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const notMarkedCount = students.filter(s => s.status === 'not-marked').length;
  const totalCount = students.length;
  const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : '0';
  
  doc.setFontSize(9);
  doc.text(`Total: ${totalCount} | Present: ${presentCount} | Absent: ${absentCount} | Not Marked: ${notMarkedCount} | Rate: ${attendanceRate}%`, 
    doc.internal.pageSize.getWidth() / 2, 61, { align: 'center' });
  
  // Prepare table data with numbering
  const tableData = students.map((student, index) => {
    return [
      (index + 1).toString(),
      student.name,
      student.email,
      student.stream,
      student.status === 'present' ? 'Present' : 
      student.status === 'absent' ? 'Absent' : 'Not Marked'
    ];
  });
  
  // Generate table with all borders
  autoTable(doc, {
    startY: 68,
    head: [['No.', 'Name', 'Email', 'Class', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
      minCellHeight: 12
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
      minCellHeight: 10
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 50, halign: 'left' },
      2: { cellWidth: 55, halign: 'left' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center' }
    },
    didDrawCell: function(data) {
      // Color code the status column
      if (data.column.index === 4 && data.section === 'body') {
        const status = data.cell.text[0];
        if (status === 'Absent') {
          data.cell.styles.textColor = [255, 0, 0];
        } else if (status === 'Present') {
          data.cell.styles.textColor = [0, 128, 0];
        } else {
          data.cell.styles.textColor = [128, 128, 128];
        }
      }
    },
    margin: { left: 15, right: 15 }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

