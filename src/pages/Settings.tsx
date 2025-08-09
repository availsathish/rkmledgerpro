import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, Upload, Info, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/Layout/Header';

const Settings: React.FC = () => {
  const { customers, transactions } = useData();

  const handleExportData = () => {
    if (!window.confirm("Do you want to download a backup of all your data?")) return;
    const data = {
      customers,
      transactions,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rkm_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.customers && data.transactions) {
              if (window.confirm('This will replace all current data with the backup file. Are you sure?')) {
                localStorage.setItem('customers', JSON.stringify(data.customers));
                localStorage.setItem('transactions', JSON.stringify(data.transactions));
                alert('Data restored successfully! The app will now reload.');
                window.location.reload();
              }
            } else {
              alert('Invalid backup file format.');
            }
          } catch (error) {
            alert('Error reading or parsing the backup file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (window.prompt('This will permanently delete all customers and transactions. This action cannot be undone. To confirm, type "DELETE" in the box below.') === 'DELETE') {
      localStorage.removeItem('customers');
      localStorage.removeItem('transactions');
      alert('All data has been cleared. The app will now reload.');
      window.location.reload();
    } else {
      alert('Deletion cancelled.');
    }
  };

  const settingsOptions = [
    { icon: Download, title: 'Export Data Backup', description: 'Save a JSON file of all data', action: handleExportData, color: 'primary' },
    { icon: Upload, title: 'Import Data Backup', description: 'Restore from a JSON file', action: handleImportData, color: 'secondary' },
    { icon: Trash2, title: 'Clear All Data', description: 'Delete all customers & transactions', action: handleClearAllData, color: 'danger' },
  ];

  return (
    <div>
      <Header title="Settings" />
      <div className="p-4 space-y-6">
        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Data Management</h3>
          <div className="space-y-3">
            {settingsOptions.map((item, index) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={item.action}
                className={`w-full flex items-center space-x-4 p-4 rounded-lg border-2 border-transparent bg-${item.color}/10 hover:border-${item.color} transition-colors`}
              >
                <item.icon size={24} className={`text-${item.color}`} />
                <div className="flex-1 text-left">
                  <div className={`font-semibold text-${item.color}`}>{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Info size={20} className="text-gray-500" />
              <div>
                <div className="font-semibold text-gray-800">App Version</div>
                <div className="text-sm text-gray-600">1.1.0 (RKM Edition)</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield size={20} className="text-gray-500" />
              <div>
                <div className="font-semibold text-gray-800">Data Privacy</div>
                <div className="text-sm text-gray-600">All data is stored securely on your device.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
