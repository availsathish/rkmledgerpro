import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CustomerForm from '../components/Forms/CustomerForm';
import Header from '../components/Layout/Header';
import { CustomerFormData } from '../types';

const EditCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { customers, updateCustomer } = useData();
  
  const customer = customers.find(c => c.id === customerId);

  const handleSubmit = (data: CustomerFormData) => {
    if (customerId) {
      updateCustomer(customerId, data);
    }
    navigate(`/customer/${customerId}/ledger`);
  };

  if (!customer) {
    return (
      <div>
        <Header title="Error" showBack />
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-900">Customer not found</h2>
        </div>
      </div>
    );
  }
  
  const initialData: Partial<CustomerFormData> = {
      name: customer.name,
      address: customer.address,
      phone: customer.phone,
      gstin: customer.gstin,
      openingBalance: customer.openingBalance
  };

  return (
    <div>
      <Header title="Edit Customer" showBack />
      
      <div className="p-4">
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <CustomerForm 
            onSubmit={handleSubmit} 
            initialData={initialData}
            submitLabel="Update Customer"
          />
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
