import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { Search, Terminal, AlertCircle, PlayCircle, BarChart2 } from 'lucide-react';

// Mock data generator
const generateMockData = (sid: string) => {
  const data = [];
  let price = sid === '2330' ? 750 : 100;
  let margin = 5000;
  let short = 1000;

  for (let i = 0; i < 60; i++) {
    // Random walk
    price = price * (1 + (Math.random() * 0.04 - 0.02));
    margin = margin + Math.floor(Math.random() * 500 - 200);
    short = short + Math.floor(Math.random() * 200 - 50);

    // Ensure positive
    margin = Math.max(margin, 0);
    short = Math.max(short, 0);

    const date = new Date();
    date.setDate(date.getDate() - (60 - i));
    
    // TradingView requires 'YYYY-MM-DD' format for time
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      close: parseFloat(price.toFixed(2)),
      margin: margin,
      short: short
    });
  }
  return data;
};

const WinningStockCheck: React.FC = () => {
  const [sid, setSid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState<any[] | null>(null);

  // Refs for chart containers
  const mainChartContainerRef = useRef<HTMLDivElement>(null);
  const subChartContainerRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = () => {
    if (!sid) return;
    
    setIsLoading(true);
    setLogs([]);
    setData(null);

    const steps = [
      `FinLab Login: FCGjFUglptI... (OK)`,
      `正在分析 ${sid} ...`,
      `下載資料起始日: ${(new Date()).toISOString().split('T')[0]}`,
      `取得 price:收盤價... OK`,
      `取得 margin_transactions:融資今日餘額... OK`,
      `取得 margin_transactions:融券今日餘額... OK`,
      `資料篩選與 DataFrame 轉換完成`,
      `啟動互動圖表 (TradingView Engine)...`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setData(generateMockData(sid));
        setIsLoading(false);
      }
    }, 400);
  };

  // Effect to Initialize TradingView Charts when data is ready
  useEffect(() => {
    if (!data) return;

    // Common Chart Options (Dark Theme)
    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: '#151A21' }, // fin-surface
        textColor: '#94A3B8', // fin-subtext
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      crosshair: {
        mode: 1, // Magnet
      },
    };

    // 1. Create Main Chart (Price)
    let mainChart: any = null;
    let subChart: any = null;

    if (mainChartContainerRef.current) {
      mainChart = createChart(mainChartContainerRef.current, {
        ...chartOptions,
        width: mainChartContainerRef.current.clientWidth,
        height: 300,
      });

      const lineSeries = mainChart.addLineSeries({
        color: '#60A5FA', // fin-primary
        lineWidth: 2,
        title: '股價',
      });

      lineSeries.setData(data.map(d => ({ time: d.date, value: d.close })));
      mainChart.timeScale().fitContent();
    }

    // 2. Create Sub Chart (Margin & Short)
    if (subChartContainerRef.current) {
      subChart = createChart(subChartContainerRef.current, {
        ...chartOptions,
        width: subChartContainerRef.current.clientWidth,
        height: 250,
      });

      // Margin (Red)
      const marginSeries = subChart.addLineSeries({
        color: '#F23645', // TW Up/Red
        lineWidth: 2,
        title: '融資餘額',
      });
      marginSeries.setData(data.map(d => ({ time: d.date, value: d.margin })));

      // Short (Green)
      const shortSeries = subChart.addLineSeries({
        color: '#089981', // TW Down/Green
        lineWidth: 2,
        title: '融券餘額',
      });
      shortSeries.setData(data.map(d => ({ time: d.date, value: d.short })));

      subChart.timeScale().fitContent();
    }

    // Handle Resize
    const handleResize = () => {
      if (mainChart && mainChartContainerRef.current) {
        mainChart.applyOptions({ width: mainChartContainerRef.current.clientWidth });
      }
      if (subChart && subChartContainerRef.current) {
        subChart.applyOptions({ width: subChartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    // Optional: Sync Visible Range (Simple one-way sync logic for demo)
    // In a full production app, you'd bind visibleLogicalRangeChange handlers
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mainChart) mainChart.remove();
      if (subChart) subChart.remove();
    };
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header / Input Section */}
      <div className="glass-panel p-8 rounded-3xl border border-fin-border shadow-glow">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-fin-text flex items-center gap-2">
              <BarChart2 className="text-fin-up" />
              飆股Check (FinLab 策略)
            </h2>
            <p className="text-fin-subtext mt-2 max-w-2xl">
              此功能模擬 Python 腳本邏輯，現在整合了 <strong>TradingView Lightweight Charts</strong> 以提供更流暢的金融圖表體驗。
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="bg-fin-surface border border-fin-border px-3 py-1 rounded text-xs text-fin-subtext font-mono">
                v1.1.0 (TV Charts)
             </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fin-subtext" />
            <input 
              type="text" 
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              placeholder="輸入股票代號 (例如 2330)" 
              className="w-full bg-fin-bg border border-fin-border focus:border-fin-primary rounded-xl pl-10 pr-4 py-3 text-fin-text focus:outline-none focus:ring-2 focus:ring-fin-primary/20 transition-all font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !sid}
            className="bg-fin-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <span className="animate-spin">⏳</span> : <PlayCircle size={18} />}
            執行分析
          </button>
        </div>
      </div>

      {/* Terminal Output Simulation */}
      {(logs.length > 0 || isLoading) && (
        <div className="bg-[#1e1e1e] rounded-xl border border-fin-border p-4 font-mono text-sm shadow-inner overflow-hidden">
          <div className="flex items-center gap-2 text-gray-400 border-b border-gray-700 pb-2 mb-2">
            <Terminal size={14} />
            <span>Console Output</span>
          </div>
          <div className="space-y-1 text-gray-300">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                <span className="text-green-500">➜</span>
                <span>{log}</span>
              </div>
            ))}
            {isLoading && <div className="animate-pulse text-fin-primary">_</div>}
          </div>
        </div>
      )}

      {/* Charts Display */}
      {data && (
        <div className="space-y-6">
          {/* Main Chart: Close Price */}
          <div className="glass-panel p-6 rounded-3xl border border-fin-border">
            <h3 className="text-lg font-bold text-fin-text mb-4">股價走勢 (TradingView)</h3>
            <div 
                ref={mainChartContainerRef} 
                className="w-full h-[300px] border border-fin-border/30 rounded-lg overflow-hidden" 
            />
          </div>

          {/* Subchart: Margin vs Short */}
          <div className="glass-panel p-6 rounded-3xl border border-fin-border">
            <h3 className="text-lg font-bold text-fin-text mb-4">資券變化 (融資=紅, 融券=綠)</h3>
            <div 
                ref={subChartContainerRef} 
                className="w-full h-[250px] border border-fin-border/30 rounded-lg overflow-hidden" 
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm">
             <AlertCircle size={16} />
             <span>注意：您正在瀏覽前端生成的模擬數據。真實部署需連接 FinLab Python API。</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinningStockCheck;