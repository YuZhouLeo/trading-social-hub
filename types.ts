export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GROUP = 'GROUP',
  FRIEND_PROFILE = 'FRIEND_PROFILE',
  SETTINGS = 'SETTINGS',
  ARCHITECT_REVIEW = 'ARCHITECT_REVIEW' // Added to address the "Critique" request
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

export interface Holding {
  id: string;
  symbol: string;
  avgPrice: number;
  quantity: number;
  currentPrice: number; // In a real app, this comes from StockCache
  pnl: number;
  pnlPercent: number;
  marketValue: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  roi: number; // Return on Investment %
  totalEquity: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: Holding[];
  watchlist: string[];
  isFriend?: boolean;
}

export interface ChartPoint {
  date: string;
  value: number;
}
