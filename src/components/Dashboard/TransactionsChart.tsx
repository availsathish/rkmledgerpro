import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Transaction } from '../../types';
import { format, subDays } from 'date-fns';

interface Props {
  transactions: Transaction[];
}

const TransactionsChart: React.FC<Props> = ({ transactions }) => {
  const options = {
    grid: { top: 40, right: 20, bottom: 30, left: 60 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 30 }).map((_, i) => format(subDays(new Date(), 29 - i), 'MMM d')),
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '₹{value}',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: 'Credit',
        data: Array.from({ length: 30 }).map((_, i) => {
          const day = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
          return transactions
            .filter(t => t.type === 'credit' && format(new Date(t.date), 'yyyy-MM-dd') === day)
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        type: 'bar',
        stack: 'total',
        color: '#22C55E' // success
      },
      {
        name: 'Debit',
        data: Array.from({ length: 30 }).map((_, i) => {
          const day = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
          return transactions
            .filter(t => t.type === 'debit' && format(new Date(t.date), 'yyyy-MM-dd') === day)
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        type: 'bar',
        stack: 'total',
        color: '#EF4444' // danger
      }
    ],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number) => `₹${value.toFixed(2)}`
    },
    legend: {
      data: ['Credit', 'Debit'],
      top: 10,
      textStyle: {
        color: '#333'
      }
    }
  };

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} notMerge={true} lazyUpdate={true} />;
};

export default TransactionsChart;
