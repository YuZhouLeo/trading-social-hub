import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Bell, 
  Menu,
  X,
  Eye,
  Lock,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import StockChart from './components/StockChart';
import ArchitectNotes from './components/ArchitectNotes';
import { analyzeStock, getPortfolioAdvice } from './services/geminiService';
import { CURRENT_USER, FRIENDS_GROUP, MOCK_MARKET_DATA } from './constants';
import { ViewState, User, Holding } from './types';

// Utility for conditional classes
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Taiwan Color Logic Helpers
// In Taiwan: Up (Positive) is RED, Down (Negative) is GREEN
const getPnLColor = (value: number) => {
  if (value > 0) return "text-tv-red"; // Red for profit
  if (value < 0) return "text-tv-green"; // Green for loss
  return "text-tv-text";
};

const getPnLSign = (value: number) => value > 0 ? '+' : '';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [activeSymbol, setActiveSymbol] = useState<string>('2330');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Determine which user data to show based on view
  const displayUser = view === ViewState.FRIEND_PROFILE && selectedFriend ? selectedFriend : CURRENT_USER;
  const isReadOnly = view === ViewState.FRIEND_PROFILE;

  // Handle Gemini Analysis
  const handleAnalyze = async () => {
    setAiAnalysis('正在分析市場數據...');
    const stock = MOCK_MARKET_DATA[activeSymbol];
    if (stock) {
      const result = await analyzeStock(stock.symbol, stock.price, stock.changePercent);
      setAiAnalysis(result || '分析失敗');
    }
  };
  
  // Navigation Handler
  const navigateToFriend = (friend: User) => {
    setSelectedFriend(friend);
    setView(ViewState.FRIEND_PROFILE);
    // Default to their top holding for the chart
    if(friend.holdings.length > 0) setActiveSymbol(friend.holdings[0].symbol);
  };

  return (
    <div className="min-h-screen bg-tv-bg text-tv-text font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-tv-panel border-r border-tv-border transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full lg:hidden"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-tv-border">
          <TrendingUp className="w-6 h-6 text-tv-red mr-2" />
          <span className="font-bold text-xl tracking-tight">StockShare TW</span>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setView(ViewState.DASHBOARD)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors", 
              view === ViewState.DASHBOARD ? "bg-tv-hover text-white" : "text-tv-subtext hover:bg-tv-hover hover:text-white")}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">儀表板</span>
          </button>
          
          <button 
            onClick={() => setView(ViewState.GROUP)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors", 
              view === ViewState.GROUP ? "bg-tv-hover text-white" : "text-tv-subtext hover:bg-tv-hover hover:text-white")}
          >
            <Users size={20} />
            <span className="font-medium">私密群組</span>
          </button>

          <button 
            onClick={() => setView(ViewState.ARCHITECT_REVIEW)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-8", 
              view === ViewState.ARCHITECT_REVIEW ? "bg-tv-blue/10 text-tv-blue" : "text-tv-subtext hover:bg-tv-hover")}
          >
            <ClipboardList size={20} />
            <span className="font-medium">架構審查</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-tv-border">
           <div className="flex items-center gap-3">
             <img src={CURRENT_USER.avatar} alt="Me" className="w-10 h-10 rounded-full border border-tv-border" />
             <div>
               <p className="text-sm font-semibold text-white">{CURRENT_USER.name}</p>
               <p className="text-xs text-tv-subtext">專業會員</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-tv-panel border-b border-tv-border flex items-center justify-between px-6 sticky top-0 z-40">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-tv-text">
               <Menu />
             </button>
             <h1 className="text-lg font-bold">
               {view === ViewState.DASHBOARD && "我的儀表板"}
               {view === ViewState.GROUP && "Alpha 小隊 (私密群組)"}
               {view === ViewState.FRIEND_PROFILE && `投資檔案: ${selectedFriend?.name}`}
               {view === ViewState.ARCHITECT_REVIEW && "系統架構審查"}
             </h1>
           </div>
           <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tv-subtext" />
               <input 
                 type="text" 
                 placeholder="搜尋代號 (例如: 2330)" 
                 className="bg-tv-bg border border-tv-border rounded px-10 py-1.5 text-sm focus:outline-none focus:border-tv-blue text-tv-text w-64"
               />
             </div>
             <Bell className="w-5 h-5 text-tv-subtext hover:text-white cursor-pointer" />
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-6">
          
          {view === ViewState.ARCHITECT_REVIEW ? (
             <ArchitectNotes />
          ) : view === ViewState.GROUP ? (
            <div className="max-w-5xl mx-auto">
               {/* Leaderboard */}
               <div className="bg-tv-panel rounded-lg border border-tv-border overflow-hidden">
                 <div className="p-4 border-b border-tv-border flex justify-between items-center">
                   <h2 className="font-bold text-lg text-tv-text">排行榜 (週投資報酬率)</h2>
                   <span className="text-xs bg-tv-blue/20 text-tv-blue px-2 py-1 rounded">更新於: 5 分鐘前</span>
                 </div>
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-tv-bg text-tv-subtext text-xs uppercase tracking-wider">
                       <th className="px-6 py-3 font-medium">排名</th>
                       <th className="px-6 py-3 font-medium">交易者</th>
                       <th className="px-6 py-3 font-medium text-right">投報率 %</th>
                       <th className="px-6 py-3 font-medium text-right">日漲跌</th>
                       <th className="px-6 py-3 font-medium text-center">操作</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-tv-border">
                     {[CURRENT_USER, ...FRIENDS_GROUP].sort((a,b) => b.roi - a.roi).map((user, idx) => (
                       <tr key={user.id} className="hover:bg-tv-hover transition-colors group">
                         <td className="px-6 py-4">
                           {idx === 0 ? <span className="text-xl">🥇</span> : 
                            idx === 1 ? <span className="text-xl">🥈</span> : 
                            <span className="text-tv-subtext font-mono">#{idx+1}</span>}
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <img src={user.avatar} className="w-8 h-8 rounded-full" alt=""/>
                             <span className={cn("font-medium", user.id === CURRENT_USER.id ? "text-tv-blue" : "text-tv-text")}>
                               {user.name} {user.id === CURRENT_USER.id && "(你)"}
                             </span>
                           </div>
                         </td>
                         <td className={cn("px-6 py-4 font-mono font-bold text-right", getPnLColor(user.roi))}>
                           {getPnLSign(user.roi)}{user.roi}%
                         </td>
                         <td className={cn("px-6 py-4 font-mono text-right text-sm", getPnLColor(user.dayChangePercent))}>
                           {user.dayChangePercent}%
                         </td>
                         <td className="px-6 py-4 text-center">
                           {user.id !== CURRENT_USER.id && (
                             <button 
                               onClick={() => navigateToFriend(user)}
                               className="text-xs bg-tv-border hover:bg-tv-subtext text-tv-text px-3 py-1 rounded transition-colors"
                             >
                               查看檔案
                             </button>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          ) : (
            // Dashboard & Friend Profile View (Shared Layout)
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
              
              {/* Left Column: Holdings & Stats */}
              <div className="lg:col-span-7 flex flex-col gap-6 h-full overflow-hidden">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-tv-panel p-4 rounded-lg border border-tv-border relative overflow-hidden">
                    <p className="text-tv-subtext text-xs font-medium uppercase mb-1">總資產 (TWD)</p>
                    <div className="text-2xl font-mono font-bold text-white">
                      {isReadOnly ? <span className="blur-sm select-none">$XXX,XXX</span> : `$${displayUser.totalEquity.toLocaleString()}`}
                    </div>
                    {!isReadOnly && <div className="absolute right-0 top-0 p-2 opacity-10"><Lock /></div>}
                  </div>
                  <div className="bg-tv-panel p-4 rounded-lg border border-tv-border">
                    <p className="text-tv-subtext text-xs font-medium uppercase mb-1">總損益</p>
                    <div className={cn("text-2xl font-mono font-bold", getPnLColor(displayUser.roi))}>
                      {getPnLSign(displayUser.roi)}{displayUser.roi}%
                    </div>
                  </div>
                  <div className="bg-tv-panel p-4 rounded-lg border border-tv-border">
                    <p className="text-tv-subtext text-xs font-medium uppercase mb-1">日漲跌</p>
                    <div className={cn("text-2xl font-mono font-bold", getPnLColor(displayUser.dayChangePercent))}>
                      {displayUser.dayChangePercent}%
                    </div>
                  </div>
                </div>

                {/* Holdings Table */}
                <div className="flex-1 bg-tv-panel rounded-lg border border-tv-border flex flex-col min-h-0">
                  <div className="p-4 border-b border-tv-border flex justify-between items-center bg-[#252936]">
                    <h3 className="font-bold text-sm text-tv-text">持有部位</h3>
                    {isReadOnly && <span className="text-xs text-tv-subtext italic">唯讀模式</span>}
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-tv-bg sticky top-0 z-10">
                         <tr className="text-tv-subtext text-xs">
                           <th className="px-4 py-2 font-medium">代號</th>
                           <th className="px-4 py-2 font-medium text-right">數量</th>
                           <th className="px-4 py-2 font-medium text-right">均價 (TWD)</th>
                           <th className="px-4 py-2 font-medium text-right">現價</th>
                           <th className="px-4 py-2 font-medium text-right">損益 %</th>
                           {!isReadOnly && <th className="px-4 py-2 font-medium text-right">市值</th>}
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-tv-border">
                        {displayUser.holdings.map(h => (
                          <tr 
                            key={h.id} 
                            onClick={() => setActiveSymbol(h.symbol)}
                            className={cn("cursor-pointer hover:bg-tv-hover transition-colors", activeSymbol === h.symbol && "bg-tv-hover/50 border-l-2 border-tv-blue")}
                          >
                            <td className="px-4 py-3 font-bold text-white">{h.symbol}</td>
                            <td className="px-4 py-3 text-right font-mono text-tv-text">{h.quantity.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono text-tv-subtext">{isReadOnly ? '---' : h.avgPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-mono text-tv-text">{h.currentPrice.toFixed(2)}</td>
                            <td className={cn("px-4 py-3 text-right font-mono font-bold", getPnLColor(h.pnlPercent))}>
                              {getPnLSign(h.pnlPercent)}{h.pnlPercent.toFixed(2)}%
                            </td>
                            {!isReadOnly && (
                              <td className="px-4 py-3 text-right font-mono text-tv-text">${h.marketValue.toLocaleString()}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Chart & AI */}
              <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                 {/* Chart */}
                 <div className="h-64 lg:h-1/2 min-h-[250px]">
                    <StockChart 
                      symbol={activeSymbol} 
                      isPositive={(MOCK_MARKET_DATA[activeSymbol]?.changePercent || 0) >= 0} 
                    />
                 </div>

                 {/* Watchlist & AI Insights */}
                 <div className="flex-1 bg-tv-panel rounded-lg border border-tv-border flex flex-col min-h-0">
                    <div className="flex border-b border-tv-border">
                       <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-tv-blue bg-tv-hover">
                         Gemini 分析
                       </button>
                       <button className="px-4 py-2 text-sm font-medium text-tv-subtext hover:text-white transition-colors">
                         關注清單
                       </button>
                    </div>
                    <div className="p-4 flex-1 overflow-auto space-y-4">
                       <div className="flex items-center justify-between">
                         <h4 className="font-bold text-white">{activeSymbol} 報告</h4>
                         <button 
                           onClick={handleAnalyze} 
                           className="flex items-center gap-1 bg-tv-blue/10 text-tv-blue px-3 py-1 rounded text-xs hover:bg-tv-blue/20 transition-colors"
                         >
                           <MessageSquare className="w-3 h-3" />
                           詢問 Gemini
                         </button>
                       </div>
                       
                       <div className="bg-tv-bg p-3 rounded border border-tv-border text-sm leading-relaxed text-tv-text animate-pulse-once">
                          {aiAnalysis ? (
                            <div className="whitespace-pre-line">{aiAnalysis}</div>
                          ) : (
                            <p className="text-tv-subtext italic">
                              點擊「詢問 Gemini」以根據當前價格 (${MOCK_MARKET_DATA[activeSymbol]?.price}) 生成 {activeSymbol} 的即時技術分析。
                            </p>
                          )}
                       </div>

                       <div className="mt-4">
                         <h5 className="text-xs font-bold text-tv-subtext uppercase mb-2">關鍵價位 (模擬)</h5>
                         <div className="grid grid-cols-2 gap-2 text-xs">
                           <div className="flex justify-between p-2 bg-tv-bg rounded">
                             <span className="text-tv-subtext">支撐位</span>
                             <span className="font-mono text-tv-red">{(MOCK_MARKET_DATA[activeSymbol]?.price * 0.95).toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between p-2 bg-tv-bg rounded">
                             <span className="text-tv-subtext">壓力位</span>
                             <span className="font-mono text-tv-green">{(MOCK_MARKET_DATA[activeSymbol]?.price * 1.05).toFixed(2)}</span>
                           </div>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}