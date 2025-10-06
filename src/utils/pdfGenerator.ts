import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface StudentAttendanceData {
  name: string;
  class: string;
  stream: string;
  status: 'present' | 'absent' | 'not-marked';
  timeMarked?: string;
  photoUrl?: string;
}

export const generateAttendancePDF = async (
  students: StudentAttendanceData[],
  title: string = 'Student Attendance Report'
) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Add header with logo and title
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  // Add date and time
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated on: ${format(new Date(), 'MMMM dd, yyyy - HH:mm:ss')}`,
    doc.internal.pageSize.getWidth() / 2,
    28,
    { align: 'center' }
  );
  
  // Add summary statistics
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const notMarkedCount = students.filter(s => s.status === 'not-marked').length;
  const totalCount = students.length;
  const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : '0';
  
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const summaryY = 35;
  doc.text(`Total Students: ${totalCount}`, 20, summaryY);
  doc.text(`Present: ${presentCount}`, 65, summaryY);
  doc.text(`Absent: ${absentCount}`, 100, summaryY);
  doc.text(`Not Marked: ${notMarkedCount}`, 135, summaryY);
  doc.text(`Attendance Rate: ${attendanceRate}%`, 180, summaryY);
  
  // Prepare table data
  const tableData = await Promise.all(
    students.map(async (student) => {
      let imgData = '';
      
      // Try to load student photo
      if (student.photoUrl) {
        try {
          imgData = await loadImageAsBase64(student.photoUrl);
        } catch (error) {
          console.warn(`Failed to load image for ${student.name}`);
        }
      }
      
      const statusText = student.status === 'present' ? 'Present' : 
                        student.status === 'absent' ? 'Absent' : 'Not Marked';
      const timeText = student.timeMarked 
        ? new Date(student.timeMarked).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : '-';
      
      return {
        photo: imgData,
        name: student.name,
        classStream: `${student.class} - ${student.stream}`,
        status: statusText,
        time: timeText
      };
    })
  );
  
  // Generate table
  autoTable(doc, {
    startY: 45,
    head: [['Photo', 'Student Name', 'Class - Stream', 'Status', 'Time Marked']],
    body: tableData.map(row => [
      row.photo ? { content: '', styles: { minCellHeight: 15 } } : '-',
      row.name,
      row.classStream,
      row.status,
      row.time
    ]),
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 60, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center' }
    },
    didDrawCell: (data) => {
      // Draw student photos in the first column
      if (data.column.index === 0 && data.row.index >= 0) {
        const studentData = tableData[data.row.index];
        if (studentData && studentData.photo) {
          try {
            const imgHeight = 12;
            const imgWidth = 12;
            const x = data.cell.x + (data.cell.width - imgWidth) / 2;
            const y = data.cell.y + (data.cell.height - imgHeight) / 2;
            doc.addImage(studentData.photo, 'JPEG', x, y, imgWidth, imgHeight);
          } catch (error) {
            console.warn('Failed to add image to PDF');
          }
        }
      }
      
      // Color code status column
      if (data.column.index === 3 && data.row.index >= 0) {
        const studentData = tableData[data.row.index];
        if (studentData) {
          if (studentData.status === 'Present') {
            doc.setFillColor(16, 185, 129);
            doc.setTextColor(255, 255, 255);
          } else if (studentData.status === 'Absent') {
            doc.setFillColor(239, 68, 68);
            doc.setTextColor(255, 255, 255);
          } else {
            doc.setFillColor(203, 213, 225);
            doc.setTextColor(71, 85, 105);
          }
          const text = studentData.status;
          const textWidth = doc.getTextWidth(text);
          const rectWidth = textWidth + 6;
          const rectHeight = 6;
          const x = data.cell.x + (data.cell.width - rectWidth) / 2;
          const y = data.cell.y + (data.cell.height - rectHeight) / 2;
          doc.roundedRect(x, y, rectWidth, rectHeight, 2, 2, 'F');
          doc.setFontSize(8);
          doc.text(text, data.cell.x + data.cell.width / 2, y + 4.5, { align: 'center' });
        }
      }
    },
    margin: { left: 10, right: 10 }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

// Helper function to load image as base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};
