import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import TransactionForm from '../components/Forms/TransactionForm';
import Header from '../components/Layout/Header';
import { TransactionFormData } from '../types';

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTransaction } = useData();

  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('customer');

  const handleSubmit = (data: TransactionFormData) => {
    addTransaction({
      ...data,
      amount: Number(data.amount),
      date: new Date(data.date),
    });

    if (data.customerId) {
      navigate(`/customer/${data.customerId}/ledger`);
    } else {
      navigate('/customers');
    }
  };

  const initialData: Partial<TransactionFormData> = {};
  if (customerId) {
    initialData.customerId = customerId;
  }

  return (
    <div>
      <Header title="Add Transaction" showBack />
      
      <div className="p-4">
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <TransactionForm onSubmit={handleSubmit} initialData={initialData} />
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
