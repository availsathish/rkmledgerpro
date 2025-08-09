import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, UserPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import CustomerCard from '../components/Cards/CustomerCard';
import Header from '../components/Layout/Header';

const CustomerList: React.FC = () => {
  const { customers, deleteCustomer, getCustomerBalance } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'outstanding' | 'advance'>('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);

      if (!matchesSearch) return false;
      
      const balance = getCustomerBalance(customer.id);

      if (filterType === 'outstanding') return balance > 0;
      if (filterType === 'advance') return balance < 0;

      return true;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [customers, searchTerm, filterType, getCustomerBalance]);

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer and all their transactions? This action cannot be undone.')) {
      deleteCustomer(customerId);
    }
  };

  return (
    <div className="pb-20">
      <Header 
        title="Customers" 
        rightContent={
          <button
            onClick={() => navigate('/add-customer')}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors shadow-md shadow-primary/30"
          >
            <Plus size={18} />
            <span className="text-sm font-semibold">New</span>
          </button>
        }
      />

      <div className="p-4">
        <div className="sticky top-16 bg-background/80 backdrop-blur-sm py-4 -mx-4 px-4 z-10">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'outstanding', label: 'Outstanding' },
                { value: 'advance', label: 'Advance' },
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value as any)}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
                    filterType === filter.value
                      ? 'bg-primary text-white shadow'
                      : 'bg-surface text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {filteredCustomers.length} found
            </div>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No Matching Customers' : 'No Customers Added'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {searchTerm 
                ? 'Try a different name or phone number, or clear the search.'
                : 'Click the "New" button at the top to add your first customer.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <AnimatePresence>
              {filteredCustomers.map(customer => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onEdit={() => navigate(`/edit-customer/${customer.id}`)}
                  onDelete={() => handleDeleteCustomer(customer.id)}
                  onViewLedger={() => navigate(`/customer/${customer.id}/ledger`)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
