import { Customer, LedgerEntry } from '../types';
import { formatCurrency, formatCurrencyWithoutSymbol } from './currency';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportLedgerToCSV = (ledgerEntries: LedgerEntry[], customerName: string) => {
  const csvData = ledgerEntries.map(entry => ({
    Date: format(new Date(entry.date), 'dd-MM-yyyy'),
    Particulars: entry.particulars,
    'Reference No.': entry.reference,
    'Debit (INR)': entry.debit > 0 ? formatCurrencyWithoutSymbol(entry.debit) : '0.00',
    'Credit (INR)': entry.credit > 0 ? formatCurrencyWithoutSymbol(entry.credit) : '0.00',
    'Balance (INR)': formatCurrencyWithoutSymbol(entry.balance),
  }));
  
  const filename = `${customerName}_ledger_${format(new Date(), 'yyyy-MM-dd')}`;
  exportToCSV(csvData, filename);
};

export const exportLedgerToPDF = (ledgerEntries: LedgerEntry[], customer: Customer, balance: number) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  doc.setFontSize(20);
  doc.text('RKM LOOM SPARES', 14, 22);
  doc.setFontSize(14);
  doc.text(`Ledger Statement for ${customer.name}`, 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Phone: ${customer.phone}`, 14, 40);
  doc.text(`Address: ${customer.address}`, 14, 45);
  doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy')}`, 150, 22);

  const tableColumn = ["Date", "Particulars", "Ref No.", "Debit (₹)", "Credit (₹)", "Balance (₹)"];
  const tableRows = ledgerEntries.map(entry => [
    format(entry.date, 'dd/MM/yyyy'),
    entry.particulars,
    entry.reference,
    entry.debit > 0 ? formatCurrency(entry.debit, false) : '',
    entry.credit > 0 ? formatCurrency(entry.credit, false) : '',
    formatCurrency(entry.balance, false)
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] }, // primary color
  });

  const finalY = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Closing Balance: ${formatCurrency(balance)}`, 14, finalY + 10);
  
  doc.save(`${customer.name}_ledger_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
};

export const exportElementAsJPEG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for export');
    return;
  }
  
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2, // Higher scale for better quality
  });
  
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.jpeg`;
  link.click();
};


export const generateWhatsAppMessage = (customer: Customer, balance: number): string => {
  const message = balance > 0 
    ? `Dear ${customer.name}, a friendly reminder from RKM LOOM SPARES. Your outstanding balance is ${formatCurrency(balance)}. Please clear your dues at the earliest. Thank you!`
    : `Dear ${customer.name}, thank you for your payment. Your current advance balance with RKM LOOM SPARES is ${formatCurrency(Math.abs(balance))}.`;
  
  return encodeURIComponent(message);
};

export const sendWhatsAppReminder = (customer: Customer, balance: number) => {
  const message = generateWhatsAppMessage(customer, balance);
  const phoneNumber = customer.phone.replace(/\D/g, '').replace(/^91/, '');
  const url = `https://wa.me/91${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
};
