import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomerFormData } from '../../types';
import { customerSchema } from '../../utils/validation';

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  initialData?: Partial<CustomerFormData>;
  submitLabel?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  onSubmit, 
  initialData, 
  submitLabel = 'Add Customer' 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(customerSchema),
    defaultValues: initialData,
  });

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className={labelClass}>
          Customer Name *
        </label>
        <input
          {...register('name')}
          type="text"
          className={inputClass}
          placeholder="Enter customer name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Phone Number *
        </label>
        <input
          {...register('phone')}
          type="tel"
          className={inputClass}
          placeholder="+91-XXXXX-XXXXX"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Address *
        </label>
        <textarea
          {...register('address')}
          rows={3}
          className={inputClass}
          placeholder="Enter complete address"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          GSTIN (Optional)
        </label>
        <input
          {...register('gstin')}
          type="text"
          className={inputClass}
          placeholder="Enter GSTIN"
        />
        {errors.gstin && (
          <p className="text-red-500 text-sm mt-1">{errors.gstin.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Opening Balance (₹) *
        </label>
        <input
          {...register('openingBalance')}
          type="number"
          step="0.01"
          className={inputClass}
          placeholder="0.00"
        />
        {errors.openingBalance && (
          <p className="text-red-500 text-sm mt-1">{errors.openingBalance.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Enter a positive value if customer owes you (debit). Enter a negative value if you owe the customer (credit).
        </p>
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

export default CustomerForm;
