import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileImage, FileType } from 'lucide-react';
import { Customer, LedgerEntry } from '../../types';
import { exportLedgerToCSV, exportLedgerToPDF, exportElementAsJPEG } from '../../utils/export';

interface ExportDropdownProps {
  ledgerEntries: LedgerEntry[];
  customer: Customer;
  balance: number;
  elementId: string;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ ledgerEntries, customer, balance, elementId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleExportCSV = () => {
    exportLedgerToCSV(ledgerEntries, customer.name);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    exportLedgerToPDF(ledgerEntries, customer, balance);
    setIsOpen(false);
  };

  const handleExportJPEG = async () => {
    await exportElementAsJPEG(elementId, `${customer.name}_ledger`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportOptions = [
    { label: 'Export as PDF', icon: FileType, action: handleExportPDF },
    { label: 'Export as CSV', icon: FileText, action: handleExportCSV },
    { label: 'Export as JPEG', icon: FileImage, action: handleExportJPEG },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary-dark transition-colors shadow-md shadow-secondary/30"
      >
        <Download size={18} />
        <span className="text-sm font-semibold">Export</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-xl z-50 border border-gray-200"
          >
            <ul className="p-1">
              {exportOptions.map(option => (
                <li key={option.label}>
                  <button
                    onClick={option.action}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <option.icon size={16} />
                    <span>{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportDropdown;
