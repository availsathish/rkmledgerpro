import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TransactionFormData } from '../../types';
import { transactionSchema } from '../../utils/validation';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Partial<TransactionFormData>;
  submitLabel?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSubmit, 
  initialData, 
  submitLabel = 'Add Transaction' 
}) => {
  const { customers } = useData();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TransactionFormData>({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      ...initialData,
    },
  });

  const selectedType = watch('type');
  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  const transactionTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'credit_customer', label: 'Credit Customer' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className={labelClass}>Customer *</label>
        <select {...register('customerId')} className={inputClass}>
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Transaction Type *</label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedType === 'credit' ? 'border-secondary shadow-md' : 'border-gray-200'}`}>
            <input {...register('type')} type="radio" value="credit" className="hidden" />
            <span className="text-green-600 font-bold">Credit (Received)</span>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedType === 'debit' ? 'border-danger shadow-md' : 'border-gray-200'}`}>
            <input {...register('type')} type="radio" value="debit" className="hidden" />
            <span className="text-red-600 font-bold">Debit (Billed)</span>
          </label>
        </div>
        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Amount (₹) *</label>
        <input {...register('amount')} type="number" step="0.01" min="0" className={inputClass} placeholder="0.00" />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Payment Method (Optional)</label>
        <select {...register('transactionType')} className={inputClass}>
          <option value="">Select payment method</option>
          {transactionTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {errors.transactionType && <p className="text-red-500 text-sm mt-1">{errors.transactionType.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Date *</label>
        <input {...register('date')} type="date" className={inputClass} />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea {...register('description')} rows={3} className={inputClass} placeholder={`E.g., Invoice payment, Goods sold, etc.`} />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Reference No.</label>
          <input {...register('referenceNumber')} type="text" className={inputClass} placeholder="Optional"/>
        </div>
        <div>
          <label className={labelClass}>Invoice No.</label>
          <input {...register('invoiceNumber')} type="text" className={inputClass} placeholder="Optional"/>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default TransactionForm;
