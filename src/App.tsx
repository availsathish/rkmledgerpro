import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import BottomNavigation from './components/Layout/BottomNavigation';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import AddTransaction from './pages/AddTransaction';
import CustomerLedger from './pages/CustomerLedger';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans">
          <main className="pb-24">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/add-customer" element={<AddCustomer />} />
              <Route path="/edit-customer/:customerId" element={<EditCustomer />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/customer/:customerId/ledger" element={<CustomerLedger />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
