import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, Server, Code, Zap } from 'lucide-react';

const ArchitectNotes: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-tv-panel border border-tv-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-tv-text mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-tv-blue" />
          系統架構審查：台股市場與 FinLab 整合
        </h2>
        <p className="text-tv-subtext mb-6">
           我已審閱您轉向<strong>台股市場</strong>並使用 <strong>FinLab</strong> 的需求。由於 FinLab 是一個基於 Python 的生態系統，將其整合到此 Next.js 應用程式中需要進行關鍵的架構決策。
        </p>

        <div className="space-y-6">
          <section>
            <h3 className="text-tv-text font-semibold flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-tv-red" />
              1. 「Python 與 Node.js」的整合斷層 (FinLab 整合)
            </h3>
            <p className="text-sm text-tv-text opacity-90 leading-relaxed">
              <strong>背景：</strong> 您提供了 FinLab API Token。然而，FinLab 主要是 Python SDK。Next.js 運行於 Node.js/Edge 環境，我們無法在此直接 import `finlab`。
              <br/>
              <strong>問題：</strong> 我們該如何橋接這兩者？
              <ul className="list-disc pl-5 mt-2 space-y-1 text-tv-subtext">
                 <li><strong>方案 A (推薦)：</strong> 建立一個獨立的 Python 後端 (FastAPI)，在其中 import `finlab` 並使用您的 Token，再暴露出 JSON REST API 供前端呼叫。</li>
                 <li><strong>方案 B：</strong> FinLab 是否提供公開的 REST URL，讓我們可以直接透過 `fetch()` 呼叫而不需透過 Python？(這需要查證其官方文件)。</li>
              </ul>
            </p>
          </section>

          <section>
            <h3 className="text-tv-text font-semibold flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-tv-blue" />
              2. 即時報價 vs FinLab (數據延遲？)
            </h3>
            <p className="text-sm text-tv-text opacity-90 leading-relaxed">
              <strong>評論：</strong> FinLab 非常適合歷史數據分析與策略回測。然而，使用者期望在「儀表板」上看到「即時 (Live)」股價。
              <br/>
              <strong>問題：</strong> FinLab 的數據對於「社交型模擬交易終端」來說夠即時嗎？或者我們需要混合使用券商 API (如永豐 Shioaji、富果 Fugle 或 永豐金 Sinopac) 來獲取即時報價，並僅將 FinLab 用於夜間的策略分析？
            </p>
          </section>

          <section>
            <h3 className="text-tv-text font-semibold flex items-center gap-2 mb-2">
               <HelpCircle className="w-4 h-4 text-tv-blue" />
              3. 台股市場特性 (零股與漲跌停)
            </h3>
            <p className="text-sm text-tv-text opacity-90 leading-relaxed">
              <strong>評論：</strong> 台灣股市有獨特的機制：10% 漲跌停限制與盤中零股交易。
              <br/>
              <strong>問題：</strong> 
              <ul className="list-disc pl-5 mt-2 space-y-1 text-tv-subtext">
                <li>我們是否需要視覺化強調觸及 10% 漲跌停的股票 (例如使用實心紅/綠背景)？</li>
                <li>我們是否需要特別支援「零股」模擬？(其手續費結構不同：最低 1 元 vs 一般交易的 20 元)。</li>
              </ul>
            </p>
          </section>

          <section>
            <h3 className="text-tv-text font-semibold flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-tv-green" />
              4. 顏色心理學轉換
            </h3>
            <p className="text-sm text-tv-text opacity-90 leading-relaxed">
              <strong>更新：</strong> 我已成功翻轉全域的顏色配置。
              <br/>
              <span className="text-tv-red font-bold">紅色 (RED)</span> 現在代表 正向/上漲 (Up)。
              <br/>
              <span className="text-tv-green font-bold">綠色 (GREEN)</span> 現在代表 負向/下跌 (Down)。
              <br/>
              這符合台灣、中國及日本市場的使用者習慣。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ArchitectNotes;