import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CustomerForm from '../components/Forms/CustomerForm';
import Header from '../components/Layout/Header';
import { CustomerFormData } from '../types';

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer } = useData();

  const handleSubmit = (data: CustomerFormData) => {
    addCustomer(data);
    navigate('/customers');
  };

  return (
    <div>
      <Header title="Add New Customer" showBack />
      
      <div className="p-4">
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <CustomerForm onSubmit={handleSubmit} submitLabel="Create Customer" />
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
