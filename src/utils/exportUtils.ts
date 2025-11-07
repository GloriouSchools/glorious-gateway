import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export type ExportFormat = "excel" | "csv" | "json" | "pdf";

interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

interface ExportOptions {
  filename: string;
  title: string;
  columns: ExportColumn[];
  data: any[];
}

export const exportData = (format: ExportFormat, options: ExportOptions) => {
  const { filename, title, columns, data } = options;

  switch (format) {
    case "excel":
      exportToExcel(filename, title, columns, data);
      break;
    case "csv":
      exportToCSV(filename, columns, data);
      break;
    case "json":
      exportToJSON(filename, data);
      break;
    case "pdf":
      exportToPDF(filename, title, columns, data);
      break;
  }
};

const exportToExcel = (
  filename: string,
  title: string,
  columns: ExportColumn[],
  data: any[]
) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => {
      const row: any = {};
      columns.forEach((col) => {
        row[col.header] = item[col.key] || "";
      });
      return row;
    })
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadBlob(blob, `${filename}.xlsx`);
};

const exportToCSV = (
  filename: string,
  columns: ExportColumn[],
  data: any[]
) => {
  const headers = columns.map((col) => col.header);
  const csvData = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key] || "";
      return typeof value === "string" && value.includes(",")
        ? `"${value}"`
        : value;
    })
  );

  const csvContent = [headers, ...csvData]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
};

const exportToJSON = (filename: string, data: any[]) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  downloadBlob(blob, `${filename}.json`);
};

const exportToPDF = (
  filename: string,
  title: string,
  columns: ExportColumn[],
  data: any[]
) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(title, 20, 20);

  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Total Records: ${data.length}`, 20, 38);

  const tableData = data.map((item) =>
    columns.map((col) => item[col.key] || "")
  );

  (doc as any).autoTable({
    head: [columns.map((col) => col.header)],
    body: tableData,
    startY: 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: columns.reduce((acc, col, index) => {
      if (col.width) {
        acc[index] = { cellWidth: col.width };
      }
      return acc;
    }, {} as any),
  });

  doc.save(`${filename}.pdf`);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
