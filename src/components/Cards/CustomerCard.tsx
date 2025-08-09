import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, MessageCircle, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { Customer } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { useData } from '../../context/DataContext';
import { sendWhatsAppReminder } from '../../utils/export';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
  onViewLedger: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ 
  customer, 
  onEdit, 
  onDelete, 
  onViewLedger 
}) => {
  const { getCustomerBalance } = useData();
  const currentBalance = getCustomerBalance(customer.id);
  
  const isOutstanding = currentBalance > 0;
  const isAdvance = currentBalance < 0;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendWhatsAppReminder(customer, currentBalance);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileTap={{ scale: 0.98 }}
      onClick={onViewLedger}
      className="bg-surface rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{customer.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Phone size={14} className="mr-2 flex-shrink-0" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-start text-sm text-gray-500 mt-1">
              <MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{customer.address}</span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-gray-100">
             <ChevronRight size={20} className="text-gray-500" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Current Balance</div>
            <div className={`text-xl font-bold ${
              isOutstanding ? 'text-danger' : 
              isAdvance ? 'text-success' : 
              'text-gray-900'
            }`}>
              {formatCurrency(Math.abs(currentBalance))}
            </div>
            <div className={`text-xs font-medium ${
              isOutstanding ? 'text-danger' : 
              isAdvance ? 'text-success' : 
              'text-gray-500'
            }`}>
              {isOutstanding && 'Outstanding'}
              {isAdvance && 'Advance'}
              {currentBalance === 0 && 'Settled'}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isOutstanding && (
              <button
                onClick={handleWhatsAppClick}
                className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                aria-label="Send WhatsApp Reminder"
              >
                <MessageCircle size={18} />
              </button>
            )}
            <button
              onClick={handleEditClick}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              aria-label="Edit Customer"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-red-100 text-danger rounded-full hover:bg-red-200 transition-colors"
              aria-label="Delete Customer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
