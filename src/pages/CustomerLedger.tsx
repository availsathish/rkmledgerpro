import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, MessageCircle, Edit } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/Layout/Header';
import { formatCurrency } from '../utils/currency';
import { sendWhatsAppReminder } from '../utils/export';
import { format } from 'date-fns';
import { LedgerEntry } from '../types';
import ExportDropdown from '../components/UI/ExportDropdown';

const CustomerLedger: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { customers, getCustomerTransactions, getCustomerBalance } = useData();
  const ledgerRef = useRef<HTMLDivElement>(null);

  const customer = customers.find(c => c.id === customerId);
  const allTransactions = getCustomerTransactions(customerId!);
  const currentBalance = getCustomerBalance(customerId!);

  const ledgerEntries = useMemo((): LedgerEntry[] => {
    if (!customer) return [];
    
    let runningBalance = customer.openingBalance;
    const entries: LedgerEntry[] = [{
      date: new Date(customer.createdAt),
      reference: 'Opening',
      particulars: 'Opening Balance',
      debit: customer.openingBalance > 0 ? customer.openingBalance : 0,
      credit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0,
      balance: runningBalance,
    }];
    
    allTransactions.forEach(t => {
      runningBalance = t.balanceAfter;
      entries.push({
        date: new Date(t.date),
        reference: t.referenceNumber || t.invoiceNumber || '-',
        particulars: t.description,
        debit: t.type === 'debit' ? t.amount : 0,
        credit: t.type === 'credit' ? t.amount : 0,
        balance: runningBalance,
        transactionId: t.id,
      });
    });

    return entries.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [customer, allTransactions]);

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

  const handleWhatsApp = () => sendWhatsAppReminder(customer, currentBalance);
  const isOutstanding = currentBalance > 0;
  const isAdvance = currentBalance < 0;

  return (
    <div>
      <Header 
        title={customer.name}
        showBack 
        rightContent={<ExportDropdown ledgerEntries={ledgerEntries} customer={customer} balance={currentBalance} elementId="ledger-view" />}
      />

      <div className="p-4 space-y-6" id="ledger-view" ref={ledgerRef}>
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-gray-600 font-medium">{customer.phone}</p>
              <p className="text-gray-500 text-sm">{customer.address}</p>
            </div>
            <button
              onClick={() => navigate(`/edit-customer/${customer.id}`)}
              className="p-2 text-primary hover:bg-primary/10 rounded-full"
            >
              <Edit size={20} />
            </button>
          </div>

          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-sm text-primary-dark">Current Balance</div>
            <div className={`text-3xl font-bold ${
              isOutstanding ? 'text-danger' : isAdvance ? 'text-success' : 'text-gray-900'
            }`}>
              {formatCurrency(Math.abs(currentBalance))}
            </div>
            <div className={`text-sm font-semibold ${
              isOutstanding ? 'text-danger' : isAdvance ? 'text-success' : 'text-gray-500'
            }`}>
              {isOutstanding ? 'Outstanding' : isAdvance ? 'Advance' : 'Settled'}
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">Transaction History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Particulars</th>
                  <th scope="col" className="px-4 py-3 text-right">Debit (₹)</th>
                  <th scope="col" className="px-4 py-3 text-right">Credit (₹)</th>
                  <th scope="col" className="px-4 py-3 text-right">Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((entry, index) => (
                  <tr key={entry.transactionId || `opening-${index}`} className="bg-surface border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {format(entry.date, 'dd MMM yy')}
                    </td>
                    <td className="px-4 py-3">{entry.particulars}</td>
                    <td className="px-4 py-3 text-right font-medium text-danger">
                      {entry.debit > 0 ? formatCurrency(entry.debit, false) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-success">
                      {entry.credit > 0 ? formatCurrency(entry.credit, false) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(entry.balance, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-24 right-4 flex flex-col space-y-3 z-30">
        {isOutstanding && (
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
            aria-label="Send Reminder"
          >
            <MessageCircle size={24} />
          </button>
        )}
        <button
          onClick={() => navigate(`/add-transaction?customer=${customerId}`)}
          className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all"
          aria-label="Add Transaction"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
};

export default CustomerLedger;
