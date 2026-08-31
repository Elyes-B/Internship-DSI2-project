import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  exportToPdf(element: HTMLElement, filename = 'document.pdf'): void {
    const options = {
    margin: 0,
    filename: filename,
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape' as 'landscape'
    }
  };
    html2pdf().set(options).from(element).save();
  }

  exportToExcel(tableElement: HTMLElement, filename = 'export.xlsx'): void {
    // 1. Generate worksheet directly from HTML table node
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

    worksheet['!cols'] = [
      { wch: 20 }, // Username
      { wch: 30 }, // Email
      { wch: 15 }, // Role
      { wch: 25 }, // Created Date
      { wch: 25 }, // Updated Date
      { wch: 12 }  // Is Deleted
    ];

    // 2. Create a new workbook and attach worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // 3. Trigger immediate file download
    XLSX.writeFile(workbook, filename);
  }
}
