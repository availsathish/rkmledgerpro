import React, { createContext, useContext, ReactNode } from 'react';
import { Customer, Transaction } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  customers: Customer[];
  transactions: Transaction[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCustomer: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'balanceAfter'>) => void;
  getCustomerTransactions: (customerId: string) => Transaction[];
  getCustomerBalance: (customerId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === id
          ? { ...customer, ...customerData, updatedAt: new Date() }
          : customer
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    setTransactions(prev => prev.filter(transaction => transaction.customerId !== id));
  };

  const getCustomerBalance = (customerId: string): number => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return 0;

    const customerTransactions = transactions.filter(t => t.customerId === customerId);
    
    return customerTransactions.reduce((balance, transaction) => {
      return transaction.type === 'credit' 
        ? balance - transaction.amount 
        : balance + transaction.amount;
    }, customer.openingBalance);
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'balanceAfter'>) => {
    const currentBalance = getCustomerBalance(transactionData.customerId);
    const balanceAfter = transactionData.type === 'credit' 
      ? currentBalance - transactionData.amount 
      : currentBalance + transactionData.amount;

    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      balanceAfter,
      createdAt: new Date(),
    };

    setTransactions(prev => [...prev, newTransaction]);
  };

  const getCustomerTransactions = (customerId: string): Transaction[] => {
    return transactions
      .filter(transaction => transaction.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <DataContext.Provider value={{
      customers,
      transactions,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addTransaction,
      getCustomerTransactions,
      getCustomerBalance,
    }}>
      {children}
    </DataContext.Provider>
  );
};
