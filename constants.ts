import { User, Stock } from './types';

// 模擬當前市場數據 - 台灣股市
export const MOCK_MARKET_DATA: Record<string, Stock> = {
  '2330': { symbol: '2330', name: '台積電', price: 780.00, change: 15.00, changePercent: 1.96, sector: '半導體' },
  '2454': { symbol: '2454', name: '聯發科', price: 1150.00, change: -20.00, changePercent: -1.71, sector: '半導體' },
  '2317': { symbol: '2317', name: '鴻海', price: 145.50, change: 4.50, changePercent: 3.19, sector: '電子代工' },
  '0050': { symbol: '0050', name: '元大台灣50', price: 155.20, change: 1.20, changePercent: 0.78, sector: 'ETF' },
  '2603': { symbol: '2603', name: '長榮海運', price: 175.00, change: -3.50, changePercent: -1.96, sector: '航運' },
  '3231': { symbol: '3231', name: '緯創', price: 120.00, change: 8.50, changePercent: 7.62, sector: '電腦周邊' },
};

// 模擬當前使用者 (我)
export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex 操盤手',
  avatar: 'https://picsum.photos/id/64/200/200',
  roi: 18.5,
  totalEquity: 2500000, // 台幣
  dayChange: 45000,
  dayChangePercent: 1.83,
  watchlist: ['2454', '2603'],
  holdings: [
    { id: 'h1', symbol: '2330', avgPrice: 600.00, quantity: 2000, currentPrice: 780.00, pnl: 360000, pnlPercent: 30.00, marketValue: 1560000 },
    { id: 'h2', symbol: '0050', avgPrice: 140.00, quantity: 5000, currentPrice: 155.20, pnl: 76000, pnlPercent: 10.86, marketValue: 776000 },
    { id: 'h3', symbol: '3231', avgPrice: 110.00, quantity: 1000, currentPrice: 120.00, pnl: 10000, pnlPercent: 9.09, marketValue: 120000 },
  ]
};

// 模擬朋友 (私密群組)
export const FRIENDS_GROUP: User[] = [
  {
    id: 'f1',
    name: 'Sarah 量化',
    avatar: 'https://picsum.photos/id/65/200/200',
    roi: 42.1,
    totalEquity: 0, // 隱藏
    dayChange: 0,
    dayChangePercent: 2.1,
    watchlist: ['2330', '2317'],
    holdings: [
      { id: 'fh1', symbol: '2317', avgPrice: 100, quantity: 5000, currentPrice: 145.50, pnl: 227500, pnlPercent: 45.5, marketValue: 727500 },
    ]
  },
  {
    id: 'f2',
    name: '當沖阿偉',
    avatar: 'https://picsum.photos/id/91/200/200',
    roi: -5.4,
    totalEquity: 0, 
    dayChange: 0,
    dayChangePercent: -0.5,
    watchlist: ['2609'],
    holdings: [
       { id: 'fh3', symbol: '2603', avgPrice: 200, quantity: 1000, currentPrice: 175.00, pnl: -25000, pnlPercent: -12.5, marketValue: 175000 },
    ]
  },
  {
    id: 'f3',
    name: '韭菜之王',
    avatar: 'https://picsum.photos/id/103/200/200',
    roi: -25.4,
    totalEquity: 0,
    dayChange: 0,
    dayChangePercent: -3.2,
    watchlist: ['6547', '3035'],
    holdings: []
  }
];

export const MOCK_CHART_DATA: Record<string, any[]> = {
  '2330': Array.from({ length: 30 }, (_, i) => ({ date: `Day ${i+1}`, value: 750 + Math.random() * 50 })),
  '0050': Array.from({ length: 30 }, (_, i) => ({ date: `Day ${i+1}`, value: 150 + Math.random() * 10 })),
  '2317': Array.from({ length: 30 }, (_, i) => ({ date: `Day ${i+1}`, value: 130 + Math.random() * 20 })),
  'PORTFOLIO': Array.from({ length: 30 }, (_, i) => ({ date: `Day ${i+1}`, value: 2000000 + (i * 15000) + (Math.random() * 50000 - 25000) })),
};