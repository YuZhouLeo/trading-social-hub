import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, Server, Code, Zap } from 'lucide-react';

const ArchitectNotes: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="glass-panel border border-fin-border rounded-3xl p-8 shadow-card">
        <h2 className="text-2xl font-bold text-fin-text mb-6 flex items-center gap-3">
          <div className="p-2 bg-fin-primary/10 rounded-xl">
             <Server className="w-6 h-6 text-fin-primary" />
          </div>
          系統架構審查
        </h2>
        <p className="text-fin-subtext mb-8 leading-relaxed">
           針對<strong>台股市場</strong>與 <strong>FinLab</strong> 的整合需求，我們進行了深入的架構分析。以下是整合 Python 生態系統與 Next.js 前端的關鍵決策點。
        </p>

        <div className="grid gap-6">
          <section className="bg-fin-bg/50 rounded-2xl p-6 border border-fin-border hover:border-fin-primary/30 transition-colors">
            <h3 className="text-fin-text font-semibold flex items-center gap-2 mb-3 text-lg">
              <Code className="w-5 h-5 text-fin-up" />
              1. 跨語言整合策略 (Python & Node.js)
            </h3>
            <p className="text-sm text-fin-subtext leading-relaxed">
              <strong>挑戰：</strong> FinLab 是純 Python SDK，無法在 Next.js (Node/Edge) 環境直接運行。
              <br/>
              <strong>架構建議：</strong> 
              <ul className="list-disc pl-5 mt-3 space-y-2 text-fin-text/80">
                 <li><span className="text-fin-primary font-medium">微服務架構 (推薦)：</span> 部署一個輕量級 FastAPI 服務作為「計算層」，專門處理 FinLab 的策略回測與選股邏輯，透過 REST API 與 Next.js 前端溝通。</li>
                 <li><span className="text-fin-subtext">無伺服器方案：</span> 若 FinLab 支援，可將腳本封裝為 AWS Lambda (Python runtime)。</li>
              </ul>
            </p>
          </section>

          <section className="bg-fin-bg/50 rounded-2xl p-6 border border-fin-border hover:border-fin-primary/30 transition-colors">
            <h3 className="text-fin-text font-semibold flex items-center gap-2 mb-3 text-lg">
              <Zap className="w-5 h-5 text-fin-primary" />
              2. 即時性與數據源混搭
            </h3>
            <p className="text-sm text-fin-subtext leading-relaxed">
              <strong>挑戰：</strong> 交易終端需要 Millisecond 等級的報價，但回測資料通常是 Daily/Minute 級別。
              <br/>
              <strong>解決方案：</strong> 採用 <span className="text-fin-text font-medium">混合數據源 (Hybrid Data Source)</span>：
              <div className="flex gap-4 mt-3">
                 <div className="flex-1 p-3 bg-fin-surface rounded-xl text-center">
                    <div className="text-xs text-fin-subtext uppercase tracking-wider mb-1">即時報價 (WebSocket)</div>
                    <div className="font-bold text-fin-text">永豐 Shioaji / 富果 API</div>
                 </div>
                 <div className="flex items-center text-fin-subtext">+</div>
                 <div className="flex-1 p-3 bg-fin-surface rounded-xl text-center">
                    <div className="text-xs text-fin-subtext uppercase tracking-wider mb-1">策略運算 (Batch)</div>
                    <div className="font-bold text-fin-text">FinLab SDK</div>
                 </div>
              </div>
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <section className="bg-fin-bg/50 rounded-2xl p-6 border border-fin-border hover:border-fin-primary/30 transition-colors">
                <h3 className="text-fin-text font-semibold flex items-center gap-2 mb-3">
                   <HelpCircle className="w-5 h-5 text-fin-primary" />
                   3. 台股特有交易機制
                </h3>
                <p className="text-sm text-fin-subtext leading-relaxed">
                   需特別處理 <strong>10% 漲跌停</strong> 的視覺警示，以及 <strong>盤中零股 (Odd Lot)</strong> 的交易手續費計算差異。
                </p>
             </section>

             <section className="bg-fin-bg/50 rounded-2xl p-6 border border-fin-border hover:border-fin-primary/30 transition-colors">
                <h3 className="text-fin-text font-semibold flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-fin-down" />
                  4. 介面在地化 (Localization)
                </h3>
                <p className="text-sm text-fin-subtext leading-relaxed">
                  已完成紅綠漲跌互換：<br/>
                  <span className="text-fin-up font-bold">紅 (Red) = 漲 (Up)</span><br/>
                  <span className="text-fin-down font-bold">綠 (Green) = 跌 (Down)</span>
                </p>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectNotes;