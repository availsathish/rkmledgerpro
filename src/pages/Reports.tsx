import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, TrendingDown, Users, PieChart } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/Layout/Header';
import { formatCurrency } from '../utils/currency';
import { exportToCSV } from '../utils/export';
import { format } from 'date-fns';

const Reports: React.FC = () => {
  const { customers, transactions, getCustomerBalance } = useData();

  const reportData = React.useMemo(() => {
    const outstandingCustomers = customers.filter(c => getCustomerBalance(c.id) > 0);
    const advanceCustomers = customers.filter(c => getCustomerBalance(c.id) < 0);
    const settledCustomers = customers.filter(c => getCustomerBalance(c.id) === 0);

    const totalOutstanding = outstandingCustomers.reduce((sum, c) => sum + getCustomerBalance(c.id), 0);
    const totalAdvance = Math.abs(advanceCustomers.reduce((sum, c) => sum + getCustomerBalance(c.id), 0));

    const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

    return {
      totalCustomers: customers.length,
      outstandingCount: outstandingCustomers.length,
      advanceCount: advanceCustomers.length,
      settledCount: settledCustomers.length,
      totalOutstanding,
      totalAdvance,
      totalCredit,
      totalDebit,
    };
  }, [customers, transactions, getCustomerBalance]);

  const handleExport = () => {
    const customerData = customers.map(customer => {
      const balance = getCustomerBalance(customer.id);
      return {
        'Customer Name': customer.name,
        'Phone': customer.phone,
        'Address': customer.address,
        'GSTIN': customer.gstin || 'N/A',
        'Current Balance (INR)': formatCurrency(balance, false),
        'Status': balance > 0 ? 'Outstanding' : balance < 0 ? 'Advance' : 'Settled',
      };
    });
    exportToCSV(customerData, `all_customers_report_${format(new Date(), 'dd-MM-yyyy')}`);
  };

  const summaryCards = [
    { title: 'Total Customers', value: reportData.totalCustomers, icon: Users, color: 'primary' },
    { title: 'Total Billed', value: formatCurrency(reportData.totalDebit), icon: TrendingUp, color: 'danger' },
    { title: 'Total Received', value: formatCurrency(reportData.totalCredit), icon: TrendingDown, color: 'success' },
    { title: 'Net Outstanding', value: formatCurrency(reportData.totalOutstanding), icon: PieChart, color: 'accent' },
  ];

  return (
    <div>
      <Header 
        title="Reports" 
        rightContent={
          <button onClick={handleExport} className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary-dark transition-colors shadow-md shadow-secondary/30">
            <Download size={18} />
            <span className="text-sm font-semibold">Export All</span>
          </button>
        }
      />

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className={`p-2 inline-block rounded-full bg-${card.color}/10 mb-2`}>
                <card.icon className={`text-${card.color}`} size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm font-medium text-gray-600">{card.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Customer Balance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-danger">Outstanding Customers</span>
              <span className="font-bold text-lg">{reportData.outstandingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-success">Advance Customers</span>
              <span className="font-bold text-lg">{reportData.advanceCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Settled Customers</span>
              <span className="font-bold text-lg">{reportData.settledCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Total Balance Summary</h3>
           <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-danger">Total Outstanding Amount</span>
              <span className="font-bold text-lg text-danger">{formatCurrency(reportData.totalOutstanding)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-success">Total Advance Amount</span>
              <span className="font-bold text-lg text-success">{formatCurrency(reportData.totalAdvance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
