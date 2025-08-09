import * as yup from 'yup';
import { validateIndianPhone } from './phone';

export const customerSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  address: yup.string().required('Address is required').min(10, 'Address must be at least 10 characters'),
  phone: yup.string()
    .required('Phone number is required')
    .test('is-valid-indian-phone', 'Invalid Indian phone number', validateIndianPhone),
  gstin: yup.string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .nullable(),
  openingBalance: yup.number().required('Opening balance is required'),
});

export const transactionSchema = yup.object({
  customerId: yup.string().required('Customer is required'),
  type: yup.string().oneOf(['credit', 'debit']).required('Transaction type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  transactionType: yup.string()
    .oneOf(['cash', 'bank_transfer', 'upi', 'cheque', 'credit_customer'])
    .optional()
    .nullable(),
  description: yup.string().required('Description is required'),
  referenceNumber: yup.string().nullable(),
  invoiceNumber: yup.string().nullable(),
  date: yup.string().required('Date is required'),
});
