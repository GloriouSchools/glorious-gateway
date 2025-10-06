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

export const generateAttendancePDF = (
  students: StudentAttendanceData[],
  title: string = 'Student Attendance Report'
) => {
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
  
  // Prepare table data with color-coded status
  const tableData = students.map(student => {
    return [
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
    head: [['Student Name', 'Email', 'Stream', 'Status']],
    body: tableData,
    theme: 'grid', // This adds all borders
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.5,
      lineColor: [0, 0, 0]
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      lineColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 50, halign: 'left' },
      1: { cellWidth: 65, halign: 'left' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' }
    },
    didParseCell: function(data) {
      // Color code the status column
      if (data.column.index === 3 && data.section === 'body') {
        const status = data.cell.text[0];
        if (status === 'Absent') {
          data.cell.styles.textColor = [255, 0, 0]; // Red for absent
        } else if (status === 'Present') {
          data.cell.styles.textColor = [0, 128, 0]; // Green for present
        } else {
          data.cell.styles.textColor = [128, 128, 128]; // Gray for not marked
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

