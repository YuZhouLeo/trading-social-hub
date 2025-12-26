import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStock = async (symbol: string, price: number, dayChange: number) => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      你是一位資深的金融分析師。
      請分析台股代號 ${symbol}。
      目前價格：${price}
      當日漲跌幅：${dayChange}%
      
      請為當沖交易者提供 3 點簡潔的技術分析摘要。
      請用「繁體中文」回答。
      不要包含免責聲明。請專注於支撐/壓力位以及動能分析。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "市場分析目前暫時無法使用。";
  }
};

export const getPortfolioAdvice = async (holdings: any[]) => {
  try {
     const model = 'gemini-3-flash-preview';
     const holdingsSummary = holdings.map(h => `${h.symbol} (${h.pnlPercent.toFixed(2)}%)`).join(', ');
     const prompt = `
        檢視以下投資組合的表現：${holdingsSummary}。
        目前的市場波動較大。
        請給我一段 50 字以內的風險評估建議。
        請用「繁體中文」回答。
     `;
     
     const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
     });
     return response.text;
  } catch (error) {
    return "投資組合分析系統離線中。";
  }
}