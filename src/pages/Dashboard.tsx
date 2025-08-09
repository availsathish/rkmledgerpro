import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/Layout/Header';
import { formatCurrency } from '../utils/currency';
import TransactionsChart from '../components/Dashboard/TransactionsChart';
import SummaryCard from '../components/Dashboard/SummaryCard';

const Dashboard: React.FC = () => {
  const { customers, transactions, getCustomerBalance } = useData();

  const summary = React.useMemo(() => {
    const totalOutstanding = customers
      .map(c => getCustomerBalance(c.id))
      .filter(bal => bal > 0)
      .reduce((sum, bal) => sum + bal, 0);

    const totalAdvance = customers
      .map(c => getCustomerBalance(c.id))
      .filter(bal => bal < 0)
      .reduce((sum, bal) => sum + bal, 0);
      
    const last30DaysTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        return date > thirtyDaysAgo;
    });

    const totalReceivedLast30Days = last30DaysTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBilledLast30Days = last30DaysTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalCustomers: customers.length,
      totalOutstanding,
      totalAdvance: Math.abs(totalAdvance),
      totalReceivedLast30Days,
      totalBilledLast30Days,
    };
  }, [customers, transactions, getCustomerBalance]);

  const summaryCards = [
    { title: 'Total Customers', value: summary.totalCustomers.toString(), icon: Users, color: 'primary' },
    { title: 'Total Outstanding', value: formatCurrency(summary.totalOutstanding), icon: TrendingUp, color: 'danger' },
    { title: 'Total Advance', value: formatCurrency(summary.totalAdvance), icon: TrendingDown, color: 'success' },
    { title: 'Total Received (30d)', value: formatCurrency(summary.totalReceivedLast30Days), icon: PieChart, color: 'accent' },
  ];

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500">Here's a summary of your business.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {summaryCards.map((card, index) => (
            <SummaryCard key={card.title} {...card} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Recent Activity (Last 30 Days)</h3>
            <div style={{ height: '250px' }}>
              <TransactionsChart transactions={transactions} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
