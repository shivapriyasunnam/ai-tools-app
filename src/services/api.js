// API service for making HTTP requests
// This will be used for calling AI endpoints and backend services

/**
 * @typedef {Object} ApiResponse
 * @property {*} data
 * @property {string} [error]
 * @property {number} status
 */


import { ALPHA_VANTAGE_API_KEY } from './keys';

export const apiService = {
  // Fetch US indices (NASDAQ, S&P 500) using Alpha Vantage (SPY, QQQ ETFs)
  async fetchUSIndices() {
    // Use Alpha Vantage GLOBAL_QUOTE for SPY (S&P 500 ETF) and QQQ (NASDAQ ETF)
    try {
      const symbols = [
        { symbol: 'SPY', label: 'S&P 500' },
        { symbol: 'QQQ', label: 'NASDAQ' }
      ];
      const results = await Promise.all(symbols.map(async ({ symbol, label }) => {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
          return {
            symbol,
            label,
            price: parseFloat(data['Global Quote']['05. price']),
            changesPercentage: parseFloat(data['Global Quote']['10. change percent']) || null,
          };
        } else {
          console.warn(`[Alpha Vantage] Unexpected response for ${symbol}:`, data);
          return null;
        }
      }));
      const filtered = results.filter(Boolean);
      if (filtered.length === 2) return filtered;
    } catch (e) {
      console.warn('[Alpha Vantage] Error fetching indices:', e);
    }
    // Fallback: Yahoo Finance unofficial API (may break in future)
    try {
      // NASDAQ: ^IXIC, S&P 500: ^GSPC
      const symbols = ['^IXIC', '^GSPC'];
      const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`);
      const data = await res.json();
      if (data && data.quoteResponse && data.quoteResponse.result) {
        if (data.quoteResponse.result.length === 2) {
          return data.quoteResponse.result.map(q => ({
            symbol: q.symbol,
            label: q.symbol === '^IXIC' ? 'NASDAQ' : 'S&P 500',
            price: q.regularMarketPrice,
            changesPercentage: q.regularMarketChangePercent,
          }));
        } else {
          console.warn('[Yahoo Finance] Indices response did not contain both NASDAQ and S&P 500:', data.quoteResponse.result, data);
        }
      } else {
        console.warn('[Yahoo Finance] Unexpected response structure:', data);
      }
    } catch (e) {
      console.warn('[Yahoo Finance] Error fetching indices:', e);
    }
    // Only log as warning, do not throw or propagate error to UI
    console.warn('US indices data could not be fetched from any source.');
    return [];
  },

  // Fetch top 3 performing US stocks using Alpha Vantage TOP_GAINERS_LOSERS endpoint
  async fetchTopUSStocks() {
    try {
      const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      // Alpha Vantage returns { top_gainers: [ ... ], top_losers: [ ... ], most_actively_traded: [ ... ] }
      if (data && data.top_gainers && Array.isArray(data.top_gainers)) {
        // Each item: { ticker, price, change_amount, change_percentage, volume }
        return data.top_gainers.slice(0, 3).map(stock => ({
          symbol: stock.ticker,
          name: stock.ticker, // No company name in free API
          price: parseFloat(stock.price),
          changesPercentage: parseFloat(stock.change_percentage),
        }));
      } else {
        console.warn('[Alpha Vantage] Unexpected response for top gainers:', data);
        return [];
      }
    } catch (e) {
      console.warn('[Alpha Vantage] Error fetching top gainers:', e);
      return [];
    }
  },
  // Fetch top 3 performing cryptocurrencies by market cap from CoinGecko
  async fetchTopCryptos() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false');
      const data = await res.json();
      // Each item: { id, symbol, name, current_price, price_change_percentage_24h }
      return data;
    } catch (e) {
      console.warn('[CoinGecko] Error fetching top cryptos:', e);
      return [];
    }
  },
};
