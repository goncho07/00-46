import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import Card from './Card';

type ChartType = 'line' | 'bar' | 'pie';
interface DynamicChartProps {
  title: string;
  data: any[];
  dataKeys: string[];
  nameKey?: string;
  colors?: string[];
}

const CHART_COLORS = [
  'var(--chart-color-1)',
  'var(--chart-color-2)',
  'var(--chart-color-3)',
  'var(--chart-color-4)',
  'var(--chart-color-5)',
  'var(--chart-color-6)',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-[var(--tooltip-bg)] shadow-lg rounded-lg border border-[var(--tooltip-border)]">
        <p className="font-bold text-base text-[var(--tooltip-text)]">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }} className="text-sm font-medium">
            {pld.name}: {pld.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DynamicChart: React.FC<DynamicChartProps> = ({ title, data, dataKeys, nameKey = 'name' }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const chartOptions = [
    { type: 'bar' as ChartType, icon: BarChart3 },
    { type: 'line' as ChartType, icon: LineChartIcon },
    { type: 'pie' as ChartType, icon: PieChartIcon },
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey={nameKey} stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
            <Legend iconSize={10}/>
            {dataKeys.map((key, i) => (
               <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={{r: 4}} activeDot={{ r: 6 }}/>
            ))}
          </LineChart>
        );
      case 'pie':
        return (
            <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} />
                <Pie data={data} dataKey={dataKeys[0]} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} label>
                     {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey={nameKey} stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
            <Legend iconSize={10}/>
            {dataKeys.map((key, i) => (
                 <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <Card className="flex flex-col h-96">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-full mt-2 sm:mt-0">
          {chartOptions.map(({ type, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`relative p-2 rounded-full transition-colors ${chartType === type ? 'text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {chartType === type && <motion.div // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
{...{
                layoutId: `chart-highlighter-${title}`
              }} className="absolute inset-0 bg-white dark:bg-slate-600 shadow-sm rounded-full" />}
              <span className="relative z-10"><Icon size={18} /></span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow w-full h-full">
        <AnimatePresence mode="wait">
            <motion.div 
                key={chartType}
                // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                {...{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.3 },
                }}
                className="w-full h-full"
            >
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default DynamicChart;