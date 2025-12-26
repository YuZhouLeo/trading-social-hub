import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_CHART_DATA } from '../constants';

interface StockChartProps {
  symbol: string;
  isPositive: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, isPositive }) => {
  const data = MOCK_CHART_DATA[symbol] || MOCK_CHART_DATA['PORTFOLIO'];
  
  // Taiwan Market Colors: Red for UP, Green for DOWN
  const upColor = '#F23645'; // Red
  const downColor = '#089981'; // Green

  const strokeColor = isPositive ? upColor : downColor;
  // Gradient fill
  const fillColor = isPositive ? 'rgba(242, 54, 69, 0.1)' : 'rgba(8, 153, 129, 0.1)';

  return (
    <div className="w-full h-full bg-tv-bg border border-tv-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-2 border-b border-tv-border flex justify-between items-center bg-tv-panel">
        <div className="flex items-baseline gap-2">
          <h3 className="text-tv-text font-bold text-lg">{symbol}</h3>
          <span className="text-xs text-tv-subtext bg-tv-border px-1 rounded">TWSE</span>
        </div>
        <div className="flex gap-2">
           {/* Fake TV Toolbar */}
           <div className="w-4 h-4 rounded-full bg-tv-border"></div>
           <div className="w-4 h-4 rounded-full bg-tv-border"></div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2E39" />
            <XAxis 
              dataKey="date" 
              hide={true} 
            />
            <YAxis 
              orientation="right" 
              tick={{ fill: '#787B86', fontSize: 11, fontFamily: 'monospace' }} 
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E222D', borderColor: '#2A2E39', color: '#D1D4DC' }}
              itemStyle={{ color: '#D1D4DC' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '價格']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              fillOpacity={1} 
              fill={`url(#color${symbol})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;