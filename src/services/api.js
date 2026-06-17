const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Accept': 'application/json',
};


export const apiService = {
  async fetchUSIndices() {
    const INDICES = [
      { symbol: '^IXIC', key: 'QQQ', label: 'NASDAQ' },
      { symbol: '^GSPC', key: 'SPY', label: 'S&P 500' },
    ];
    try {
      const results = await Promise.all(
        INDICES.map(async ({ symbol, key, label }) => {
          const res = await fetch(
            `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2d&interval=1d`,
            { headers: YAHOO_HEADERS }
          );
          if (!res.ok) return null;
          const data = await res.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta?.regularMarketPrice) return null;
          return {
            symbol: key,
            label,
            price: Math.round(meta.regularMarketPrice * 100) / 100,
            changesPercentage: Math.round((meta.regularMarketChangePercent ?? 0) * 100) / 100,
          };
        })
      );
      return results.filter(Boolean);
    } catch (e) {
      console.warn('[Finance] Error fetching indices:', e);
      return [];
    }
  },

  async fetchTopUSStocks() {
    const WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA'];
    try {
      const results = await Promise.all(
        WATCHLIST.map(async (symbol) => {
          const res = await fetch(
            `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?range=2d&interval=1d`,
            { headers: YAHOO_HEADERS }
          );
          if (!res.ok) return null;
          const data = await res.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta?.regularMarketPrice) return null;
          return {
            symbol,
            name: meta.shortName || symbol,
            price: Math.round(meta.regularMarketPrice * 100) / 100,
            changesPercentage: Math.round((meta.regularMarketChangePercent ?? 0) * 100) / 100,
          };
        })
      );
      return results
        .filter(Boolean)
        .sort((a, b) => b.changesPercentage - a.changesPercentage)
        .slice(0, 3);
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

  async fetchCommodities() {
    const COMMODITIES = [
      { symbol: 'GC=F', name: 'Gold' },
      { symbol: 'SI=F', name: 'Silver' },
      { symbol: 'CL=F', name: 'Crude Oil' },
    ];
    try {
      const results = await Promise.all(
        COMMODITIES.map(async ({ symbol, name }) => {
          const res = await fetch(
            `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2d&interval=1d`,
            { headers: YAHOO_HEADERS }
          );
          if (!res.ok) return null;
          const data = await res.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta?.regularMarketPrice) return null;
          return {
            symbol,
            name,
            price: Math.round(meta.regularMarketPrice * 100) / 100,
            changesPercentage: Math.round((meta.regularMarketChangePercent ?? 0) * 100) / 100,
          };
        })
      );
      return results.filter(Boolean);
    } catch (e) {
      console.warn('[Finance] Error fetching commodities:', e);
      return [];
    }
  },

  async fetchSentiment() {
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=1');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const entry = data.data?.[0];
      if (!entry) return null;
      return {
        value: parseInt(entry.value, 10),
        value_classification: entry.value_classification,
        timestamp: entry.timestamp,
      };
    } catch (e) {
      console.warn('[Hub] Error fetching sentiment:', e);
      return null;
    }
  },

  async fetchNews() {
    try {
      const res = await fetch('https://feeds.bbci.co.uk/news/rss.xml');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const xml = await res.text();
      const items = [];
      const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
      for (const match of itemMatches) {
        const block = match[1];
        const title =
          block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s)?.[1] ||
          block.match(/<title>(.*?)<\/title>/s)?.[1] || '';
        const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
        const link =
          block.match(/<link>(.*?)<\/link>/s)?.[1] ||
          block.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/)?.[1] || '';
        if (title) items.push({ title: title.trim(), source: 'BBC News', published: pubDate, link });
        if (items.length >= 5) break;
      }
      return items;
    } catch (e) {
      console.warn('[Hub] Error fetching news:', e);
      return [];
    }
  },
};
