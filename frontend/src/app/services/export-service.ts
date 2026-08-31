import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  // pdf parameters
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
  // we save the html element  and export it as pdf
    html2pdf().set(options).from(element).save();
  }

  exportToExcel(tableElement: HTMLElement, filename = 'export.xlsx'): void {
    // it takes the table from the html element provides and automatically turns it into an excel file
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

    //sizes used for the excel columns
    worksheet['!cols'] = [
      { wch: 20 }, // Username
      { wch: 30 }, // Email
      { wch: 15 }, // Role
      { wch: 25 }, // Created Date
      { wch: 25 }, // Updated Date
      { wch: 12 }  // Is Deleted
    ];

    // prepare the excel file
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // execute the file and download it
    XLSX.writeFile(workbook, filename);
  }
}
