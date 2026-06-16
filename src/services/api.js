const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const apiService = {
  async fetchUSIndices() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/finance/indices`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      return Object.entries(data).map(([symbol, quote]) => ({
        symbol,
        label: symbol === 'SPY' ? 'S&P 500' : 'NASDAQ',
        price: parseFloat(quote.price || 0),
        changesPercentage: parseFloat(quote.changesPercentage || 0),
      }));
    } catch (e) {
      console.warn('[Finance] Error fetching indices:', e);
      return [];
    }
  },

  async fetchTopUSStocks() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/finance/stocks`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data?.top_gainers) {
        return data.top_gainers.slice(0, 3).map(stock => ({
          symbol: stock.ticker,
          name: stock.ticker,
          price: parseFloat(stock.price),
          changesPercentage: parseFloat(stock.change_percentage),
        }));
      }
      return [];
    } catch (e) {
      console.warn('[Finance] Error fetching top stocks:', e);
      return [];
    }
  },

  async fetchTopCryptos() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/finance/crypto`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    } catch (e) {
      console.warn('[Finance] Error fetching top cryptos:', e);
      return [];
    }
  },
};
