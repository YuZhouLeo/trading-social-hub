import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  TrendingUp, 
  Search, 
  Bell, 
  Menu,
  MoreHorizontal,
  ArrowUpRight,
  Rocket, // Added Rocket icon
  ClipboardList
} from 'lucide-react';
import StockChart from './components/StockChart';
import ArchitectNotes from './components/ArchitectNotes';
import WinningStockCheck from './components/WinningStockCheck';
import { CURRENT_USER, FRIENDS_GROUP, MOCK_MARKET_DATA } from './constants';
import { ViewState, User } from './types';

// Utility for conditional classes
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Taiwan Color Logic Helpers
const getPnLColor = (value: number) => {
  if (value > 0) return "text-fin-up";
  if (value < 0) return "text-fin-down";
  return "text-fin-text";
};

const getPnLBg = (value: number) => {
  if (value > 0) return "bg-fin-up/10 text-fin-up";
  if (value < 0) return "bg-fin-down/10 text-fin-down";
  return "bg-fin-subtext/10 text-fin-subtext";
};

const getPnLSign = (value: number) => value > 0 ? '+' : '';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [activeSymbol, setActiveSymbol] = useState<string>('2330');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const displayUser = view === ViewState.FRIEND_PROFILE && selectedFriend ? selectedFriend : CURRENT_USER;
  const isReadOnly = view === ViewState.FRIEND_PROFILE;
  
  const navigateToFriend = (friend: User) => {
    setSelectedFriend(friend);
    setView(ViewState.FRIEND_PROFILE);
    if(friend.holdings.length > 0) setActiveSymbol(friend.holdings[0].symbol);
  };

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text font-sans flex overflow-hidden selection:bg-fin-primary/30">
      
      {/* Modern Sidebar (Floating Glass) */}
      <aside className={cn(
        "fixed inset-y-4 left-4 z-50 w-72 glass-panel border border-fin-border rounded-3xl flex flex-col transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:inset-y-0 lg:left-0 lg:m-4 lg:w-64 shadow-2xl",
        !isSidebarOpen && "-translate-x-[120%] lg:hidden"
      )}>
        <div className="h-20 flex items-center px-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fin-up to-orange-500 flex items-center justify-center shadow-glow">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl ml-3 tracking-tight">StockShare</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-fin-subtext px-4 mb-2 uppercase tracking-wider">選單</div>
          
          <button 
            onClick={() => setView(ViewState.DASHBOARD)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group", 
              view === ViewState.DASHBOARD ? "bg-fin-primary text-white shadow-glow" : "text-fin-subtext hover:bg-fin-surfaceHover hover:text-fin-text")}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">儀表板</span>
          </button>
          
          <button 
            onClick={() => setView(ViewState.GROUP)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group", 
              view === ViewState.GROUP ? "bg-fin-primary text-white shadow-glow" : "text-fin-subtext hover:bg-fin-surfaceHover hover:text-fin-text")}
          >
            <Users size={20} />
            <span className="font-medium">私密群組</span>
          </button>

          {/* 新增：飆股Check 按鈕 */}
          <button 
            onClick={() => setView(ViewState.WINNING_CHECK)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group mt-4", 
              view === ViewState.WINNING_CHECK 
                ? "bg-gradient-to-r from-fin-up to-orange-500 text-white shadow-glow" 
                : "text-fin-subtext hover:bg-fin-surfaceHover hover:text-fin-text")}
          >
            <Rocket size={20} />
            <span className="font-medium">飆股Check</span>
          </button>

          <button 
            onClick={() => setView(ViewState.ARCHITECT_REVIEW)}
            className={cn("w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 mt-8 group", 
              view === ViewState.ARCHITECT_REVIEW ? "bg-fin-surface border border-fin-primary/30 text-fin-primary" : "text-fin-subtext hover:bg-fin-surfaceHover hover:text-fin-text")}
          >
            <ClipboardList size={20} />
            <span className="font-medium">架構審查</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto">
           <div className="glass-panel border border-fin-border p-3 rounded-2xl flex items-center gap-3 hover:border-fin-primary/50 transition-colors cursor-pointer">
             <img src={CURRENT_USER.avatar} alt="Me" className="w-10 h-10 rounded-full border-2 border-fin-surface" />
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-fin-text truncate">{CURRENT_USER.name}</p>
               <p className="text-xs text-fin-primary">PRO 會員</p>
             </div>
             <Settings size={16} className="text-fin-subtext" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative mr-4 my-4 rounded-3xl bg-fin-bg border-none">
        
        {/* Top Navigation Bar */}
        <header className="h-20 flex items-center justify-between px-2 lg:px-6 mb-2">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 bg-fin-surface rounded-full text-fin-text">
               <Menu size={20} />
             </button>
             <div>
               <h1 className="text-2xl font-bold text-fin-text tracking-tight">
                 {view === ViewState.DASHBOARD && "早安，Alex"}
                 {view === ViewState.GROUP && "Alpha 小隊排行榜"}
                 {view === ViewState.FRIEND_PROFILE && selectedFriend?.name}
                 {view === ViewState.WINNING_CHECK && "FinLab 飆股掃描"}
                 {view === ViewState.ARCHITECT_REVIEW && "系統架構中心"}
               </h1>
               <p className="text-sm text-fin-subtext hidden md:block">
                 {view === ViewState.WINNING_CHECK ? "整合 Python FinLab 策略的即時籌碼分析工具。" : (view === ViewState.DASHBOARD ? "市場波動加劇，請注意風險控管。" : "與戰友們的投資績效對決。")}
               </p>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="relative hidden md:block group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fin-subtext group-focus-within:text-fin-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="搜尋代號 (2330)..." 
                 className="bg-fin-surface border border-transparent focus:border-fin-primary/50 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-fin-primary/10 text-fin-text w-64 transition-all"
               />
             </div>
             <button className="relative p-2.5 rounded-full hover:bg-fin-surface transition-colors">
               <Bell className="w-5 h-5 text-fin-subtext" />
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-fin-up rounded-full border-2 border-fin-bg"></span>
             </button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 lg:p-6 space-y-8 custom-scrollbar">
          
          {view === ViewState.ARCHITECT_REVIEW ? (
             <ArchitectNotes />
          ) : view === ViewState.WINNING_CHECK ? (
             <WinningStockCheck />
          ) : view === ViewState.GROUP ? (
            <div className="max-w-6xl mx-auto space-y-6">
               {/* Podium / Top Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 {[CURRENT_USER, ...FRIENDS_GROUP].sort((a,b) => b.roi - a.roi).slice(0,3).map((user, idx) => (
                   <div key={user.id} className={cn(
                     "relative p-6 rounded-3xl border flex flex-col items-center text-center overflow-hidden",
                     idx === 0 ? "glass-panel border-fin-up/30 shadow-glow" : "bg-fin-surface/50 border-fin-border"
                   )}>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fin-primary to-transparent opacity-50"></div>
                      <div className="text-4xl mb-4">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                      <img src={user.avatar} className="w-16 h-16 rounded-full border-4 border-fin-bg mb-3 shadow-lg" alt=""/>
                      <h3 className="font-bold text-lg text-fin-text">{user.name}</h3>
                      <div className={cn("text-2xl font-mono font-bold mt-2", getPnLColor(user.roi))}>
                        {getPnLSign(user.roi)}{user.roi}%
                      </div>
                      <p className="text-xs text-fin-subtext mt-1">週報酬率</p>
                   </div>
                 ))}
               </div>

               {/* Full Table */}
               <div className="glass-panel rounded-3xl border border-fin-border overflow-hidden">
                 <div className="p-6 border-b border-fin-border flex justify-between items-center">
                   <h2 className="font-bold text-lg text-fin-text">完整排行榜</h2>
                   <button className="text-sm text-fin-primary hover:text-fin-primary/80">匯出報表</button>
                 </div>
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-fin-surface/50 text-fin-subtext text-xs uppercase tracking-wider">
                       <th className="px-8 py-4 font-medium">排名</th>
                       <th className="px-8 py-4 font-medium">交易者</th>
                       <th className="px-8 py-4 font-medium text-right">總報酬 (ROI)</th>
                       <th className="px-8 py-4 font-medium text-right">今日損益</th>
                       <th className="px-8 py-4 font-medium text-center"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-fin-border">
                     {[CURRENT_USER, ...FRIENDS_GROUP].sort((a,b) => b.roi - a.roi).map((user, idx) => (
                       <tr key={user.id} className="hover:bg-fin-surfaceHover/50 transition-colors group">
                         <td className="px-8 py-5 text-fin-subtext font-mono text-lg">#{idx+1}</td>
                         <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                             <img src={user.avatar} className="w-10 h-10 rounded-full" alt=""/>
                             <div>
                               <div className={cn("font-bold text-sm", user.id === CURRENT_USER.id ? "text-fin-primary" : "text-fin-text")}>
                                 {user.name}
                               </div>
                               <div className="text-xs text-fin-subtext">一般會員</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                           <span className={cn("px-3 py-1 rounded-lg font-mono font-bold text-sm", getPnLBg(user.roi))}>
                             {getPnLSign(user.roi)}{user.roi}%
                           </span>
                         </td>
                         <td className={cn("px-8 py-5 text-right font-mono font-medium", getPnLColor(user.dayChangePercent))}>
                           {user.dayChangePercent}%
                         </td>
                         <td className="px-8 py-5 text-center">
                           <button onClick={() => navigateToFriend(user)} className="p-2 text-fin-subtext hover:bg-fin-surface rounded-full transition-colors">
                             <MoreHorizontal size={18} />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          ) : (
            // Dashboard & Profile
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10">
              
              {/* Left Main Column */}
              <div className="xl:col-span-8 flex flex-col gap-8">
                {/* Hero Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Equity Card */}
                  <div className="glass-panel p-6 rounded-3xl border border-fin-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-fin-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-fin-primary/20 transition-all"></div>
                    <p className="text-fin-subtext text-xs font-bold uppercase tracking-widest mb-2">總資產 (TWD)</p>
                    <div className="text-3xl font-mono font-bold text-fin-text tracking-tight mb-2">
                      {isReadOnly ? <span className="blur-sm select-none opacity-50">$XXX,XXX</span> : `$${displayUser.totalEquity.toLocaleString()}`}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-fin-subtext">
                       <div className="flex items-center text-fin-up bg-fin-up/10 px-1.5 py-0.5 rounded">
                         <ArrowUpRight size={14} className="mr-1"/> +2.4%
                       </div>
                       <span>較上週</span>
                    </div>
                  </div>

                  {/* ROI Card */}
                  <div className="glass-panel p-6 rounded-3xl border border-fin-border">
                    <p className="text-fin-subtext text-xs font-bold uppercase tracking-widest mb-2">總投資報酬率</p>
                    <div className={cn("text-3xl font-mono font-bold tracking-tight mb-2", getPnLColor(displayUser.roi))}>
                      {getPnLSign(displayUser.roi)}{displayUser.roi}%
                    </div>
                    <div className="w-full bg-fin-surface rounded-full h-1.5 mt-4 overflow-hidden">
                      <div className={cn("h-full rounded-full", displayUser.roi >= 0 ? "bg-fin-up" : "bg-fin-down")} style={{ width: `${Math.min(Math.abs(displayUser.roi), 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Day Change Card */}
                  <div className="glass-panel p-6 rounded-3xl border border-fin-border">
                    <p className="text-fin-subtext text-xs font-bold uppercase tracking-widest mb-2">今日損益</p>
                    <div className={cn("text-3xl font-mono font-bold tracking-tight mb-2", getPnLColor(displayUser.dayChangePercent))}>
                      {getPnLSign(displayUser.dayChangePercent)}{displayUser.dayChangePercent}%
                    </div>
                    <p className="text-sm text-fin-subtext">
                      {isReadOnly ? '---' : `+$${displayUser.dayChange.toLocaleString()}`}
                    </p>
                  </div>
                </div>

                {/* Chart Section */}
                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-fin-border min-h-[400px] flex flex-col">
                   <StockChart 
                      symbol={activeSymbol} 
                      isPositive={(MOCK_MARKET_DATA[activeSymbol]?.changePercent || 0) >= 0} 
                   />
                </div>

                {/* Holdings Section (Modern List) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold text-xl text-fin-text">持有部位</h3>
                    <button className="text-sm text-fin-primary hover:text-fin-primary/80 transition-colors">查看全部</button>
                  </div>
                  <div className="grid gap-3">
                    {displayUser.holdings.map(h => (
                      <div 
                        key={h.id} 
                        onClick={() => setActiveSymbol(h.symbol)}
                        className={cn(
                          "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                          activeSymbol === h.symbol 
                            ? "bg-fin-primary/5 border-fin-primary/50 shadow-glow" 
                            : "bg-fin-surface border-transparent hover:bg-fin-surfaceHover hover:border-fin-border"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm", activeSymbol === h.symbol ? "bg-fin-primary text-white" : "bg-fin-bg text-fin-subtext group-hover:text-fin-text")}>
                            {h.symbol.slice(0,2)}
                          </div>
                          <div>
                            <h4 className="font-bold text-fin-text">{h.symbol}</h4>
                            <p className="text-xs text-fin-subtext">{MOCK_MARKET_DATA[h.symbol]?.name || 'Stock'}</p>
                          </div>
                        </div>

                        <div className="hidden md:block text-right">
                          <p className="text-xs text-fin-subtext mb-1">現價</p>
                          <p className="font-mono text-fin-text font-medium">{h.currentPrice}</p>
                        </div>

                        <div className="hidden md:block text-right">
                           <p className="text-xs text-fin-subtext mb-1">損益</p>
                           <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-bold", getPnLBg(h.pnlPercent))}>
                             {getPnLSign(h.pnlPercent)}{h.pnlPercent.toFixed(2)}%
                           </span>
                        </div>

                        {!isReadOnly && (
                          <div className="text-right min-w-[100px]">
                            <p className="text-xs text-fin-subtext mb-1">市值</p>
                            <p className="font-mono text-fin-text font-bold">${(h.marketValue/1000).toFixed(0)}k</p>
                          </div>
                        )}
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={16} className="text-fin-subtext" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Market Status (AI removed) */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                 {/* Market Status (Mini) */}
                 <div className="glass-panel p-6 rounded-3xl border border-fin-border">
                    <h4 className="text-sm font-bold text-fin-subtext uppercase mb-4">市場概況 (TWSE)</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-fin-text">加權指數</span>
                        <span className="font-mono text-fin-up font-bold">20,120.50 (+0.8%)</span>
                      </div>
                      <div className="w-full bg-fin-surface rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-fin-up rounded-full w-[65%]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-fin-subtext mt-1">
                        <span>成交量: 3,500億</span>
                        <span>強勢</span>
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