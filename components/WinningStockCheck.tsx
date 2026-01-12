import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Search, Terminal, AlertCircle, PlayCircle, BarChart2, ServerCrash, Settings } from 'lucide-react';

const WinningStockCheck: React.FC = () => {
  const [sid, setSid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [showApiInput, setShowApiInput] = useState(false);
  
  // 優先使用環境變數，如果沒有則使用預設值
  // 在 Zeabur 上，前端通常需要手動設定這個環境變數，或者我們允許使用者在 UI 輸入
  const [apiUrl, setApiUrl] = useState(() => {
    // 如果是本地開發
    if (window.location.hostname === 'localhost') return "http://127.0.0.1:8000";
    // 預設嘗試讀取環境變數 (需要在 Zeabur 前端服務設定 NEXT_PUBLIC_API_URL)
    // 如果沒設定，預設為空，讓使用者輸入
    return ""; 
  });

  // Refs for chart containers
  const mainChartContainerRef = useRef<HTMLDivElement>(null);
  const subChartContainerRef = useRef<HTMLDivElement>(null);
  const mainChartRef = useRef<any>(null);
  const subChartRef = useRef<any>(null);

  const handleAnalyze = async () => {
    if (!sid) return;
    if (!apiUrl) {
        setError("請點擊設定 (齒輪圖示) 輸入您的後端 API 網址 (例如 https://xxx.zeabur.app)");
        setShowApiInput(true);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setData(null);

    // 移除 URL 尾部的斜線
    const cleanUrl = apiUrl.replace(/\/$/, "");

    try {
      console.log(`Fetching from: ${cleanUrl}/analyze/${sid}`);
      const response = await fetch(`${cleanUrl}/analyze/${sid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API 請求失敗 (${response.status})`);
      }

      const result = await response.json();
      
      if (Array.isArray(result)) {
         setData(result);
      } else {
         throw new Error("回傳資料格式錯誤，必須是陣列");
      }

    } catch (err: any) {
      console.error(err);
      setError(`無法連接伺服器: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to Initialize TradingView Charts
  useEffect(() => {
    if (!data || data.length === 0) return;

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: '#151A21' },
        textColor: '#94A3B8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      rightPriceScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
      timeScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
      crosshair: { mode: 1 },
    };

    // 1. Create Main Chart (Price)
    if (mainChartContainerRef.current) {
      if (mainChartRef.current) mainChartRef.current.remove();

      const chart = createChart(mainChartContainerRef.current, {
        ...chartOptions,
        width: mainChartContainerRef.current.clientWidth,
        height: 300,
      });
      mainChartRef.current = chart;

      const lineSeries = chart.addLineSeries({
        color: '#60A5FA', lineWidth: 2, title: '股價',
      });

      const priceData = data
        .map(d => ({ time: d.date, value: d.close }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        
      lineSeries.setData(priceData);
      chart.timeScale().fitContent();
    }

    // 2. Create Sub Chart (Margin & Short)
    if (subChartContainerRef.current) {
      if (subChartRef.current) subChartRef.current.remove();

      const chart = createChart(subChartContainerRef.current, {
        ...chartOptions,
        width: subChartContainerRef.current.clientWidth,
        height: 250,
      });
      subChartRef.current = chart;

      const marginSeries = chart.addLineSeries({
        color: '#F23645', lineWidth: 2, title: '融資餘額',
      });
      const marginData = data
        .map(d => ({ time: d.date, value: d.margin }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      marginSeries.setData(marginData);

      const shortSeries = chart.addLineSeries({
        color: '#089981', lineWidth: 2, title: '融券餘額',
      });
      const shortData = data
        .map(d => ({ time: d.date, value: d.short }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      shortSeries.setData(shortData);

      chart.timeScale().fitContent();
    }

    const handleResize = () => {
      if (mainChartRef.current && mainChartContainerRef.current) {
        mainChartRef.current.applyOptions({ width: mainChartContainerRef.current.clientWidth });
      }
      if (subChartRef.current && subChartContainerRef.current) {
        subChartRef.current.applyOptions({ width: subChartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mainChartRef.current) mainChartRef.current.remove();
      if (subChartRef.current) subChartRef.current.remove();
    };
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-8 rounded-3xl border border-fin-border shadow-glow">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-fin-text flex items-center gap-2">
              <BarChart2 className="text-fin-up" />
              飆股Check
            </h2>
            <p className="text-fin-subtext mt-2 max-w-2xl">
              Python FinLab 數據串接
            </p>
          </div>
          <button 
            onClick={() => setShowApiInput(!showApiInput)}
            className="p-2 text-fin-subtext hover:text-fin-text bg-fin-surface rounded-lg border border-fin-border"
          >
            <Settings size={18} />
          </button>
        </div>

        {showApiInput && (
            <div className="mb-4 p-4 bg-fin-surface/50 rounded-xl border border-fin-primary/30">
                <label className="text-xs text-fin-primary block mb-2 font-bold">後端 API 網址 (部署後請填入 Zeabur 後端網域)</label>
                <input 
                    type="text" 
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://your-api.zeabur.app"
                    className="w-full bg-fin-bg border border-fin-border rounded-lg px-3 py-2 text-sm text-fin-text font-mono"
                />
            </div>
        )}

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fin-subtext" />
            <input 
              type="text" 
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              placeholder="輸入代號 (2330)" 
              className="w-full bg-fin-bg border border-fin-border focus:border-fin-primary rounded-xl pl-10 pr-4 py-3 text-fin-text focus:outline-none transition-all font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !sid}
            className="bg-fin-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <span className="animate-spin">⏳</span> : <PlayCircle size={18} />}
            執行
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
          <ServerCrash size={20} />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-fin-border">
            <h3 className="text-lg font-bold text-fin-text mb-4">股價</h3>
            <div ref={mainChartContainerRef} className="w-full h-[300px] border border-fin-border/30 rounded-lg overflow-hidden" />
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-fin-border">
            <h3 className="text-lg font-bold text-fin-text mb-4">資券</h3>
            <div ref={subChartContainerRef} className="w-full h-[250px] border border-fin-border/30 rounded-lg overflow-hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WinningStockCheck;