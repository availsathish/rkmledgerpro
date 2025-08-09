export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  gstin?: string;
  openingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: 'credit' | 'debit';
  amount: number;
  transactionType?: 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'credit_customer';
  description: string;
  referenceNumber?: string;
  invoiceNumber?: string;
  date: Date;
  balanceAfter: number;
  createdAt: Date;
}

export interface TransactionFormData {
  customerId: string;
  type: 'credit' | 'debit';
  amount: number;
  transactionType?: 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'credit_customer';
  description: string;
  referenceNumber?: string;
  invoiceNumber?: string;
  date: string;
}

export interface CustomerFormData {
  name: string;
  address: string;
  phone: string;
  gstin?: string;
  openingBalance: number;
}

export interface LedgerEntry {
  date: Date;
  reference: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
  transactionId?: string;
}
