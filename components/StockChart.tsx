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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h3 className="text-fin-text font-bold text-2xl tracking-tight">{symbol}</h3>
             <span className="text-[10px] font-bold text-fin-bg bg-fin-subtext/20 text-fin-subtext px-1.5 py-0.5 rounded">TWSE</span>
           </div>
           <p className="text-xs text-fin-subtext">即時走勢圖 (1D)</p>
        </div>
        <div className="flex gap-2">
           <button className="w-8 h-8 rounded-full bg-fin-surface border border-fin-border flex items-center justify-center text-xs text-fin-subtext hover:bg-fin-surfaceHover transition-colors">1D</button>
           <button className="w-8 h-8 rounded-full hover:bg-fin-surfaceHover border border-transparent flex items-center justify-center text-xs text-fin-subtext transition-colors">1W</button>
        </div>
      </div>
      
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-b from-fin-surface/30 to-transparent border border-fin-border/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" hide={true} />
            <YAxis 
              orientation="right" 
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }} 
              axisLine={false}
              tickLine={false}
              width={40}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(21, 26, 33, 0.9)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                color: '#F1F5F9',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
              itemStyle={{ color: '#F1F5F9' }}
              cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '價格']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color${symbol})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;