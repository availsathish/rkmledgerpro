import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
  color: 'primary' | 'danger' | 'success' | 'accent';
  index: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, color, index }) => {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    danger: 'bg-danger/10 text-danger',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-surface rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`p-2 inline-block rounded-full ${colors[color]} mb-2`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
