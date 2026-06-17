
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Card } from '../../src/components/ui';
import { colors, spacing } from '../../src/constants';
import { useTheme } from '../../src/context/ThemeContext';
import { apiService } from '../../src/services/api';

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-7933176628735047/5587939995';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return '';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function sentimentColor(value) {
  if (value <= 25) return '#ef4444';
  if (value <= 45) return '#f97316';
  if (value <= 55) return '#94a3b8';
  if (value <= 75) return '#86efac';
  return '#22c55e';
}

function changeColor(pct) {
  return pct >= 0 ? '#22c55e' : '#ef4444';
}

export default function HubScreen() {
  const { theme } = useTheme();

  const [marketStats, setMarketStats] = useState(null);
  const [topStocks, setTopStocks] = useState(null);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [errorStocks, setErrorStocks] = useState(null);

  const [topCryptos, setTopCryptos] = useState(null);
  const [loadingCryptos, setLoadingCryptos] = useState(true);
  const [errorCryptos, setErrorCryptos] = useState(null);

  const [commodities, setCommodities] = useState(null);
  const [loadingCommodities, setLoadingCommodities] = useState(true);
  const [errorCommodities, setErrorCommodities] = useState(null);

  const [sentiment, setSentiment] = useState(null);
  const [loadingSentiment, setLoadingSentiment] = useState(true);
  const [errorSentiment, setErrorSentiment] = useState(null);

  const [news, setNews] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorNews, setErrorNews] = useState(null);

  useEffect(() => {
    async function fetchStocksAndIndices() {
      setLoadingStocks(true);
      setErrorStocks(null);
      try {
        const [indices, stocks] = await Promise.all([
          apiService.fetchUSIndices(),
          apiService.fetchTopUSStocks(),
        ]);
        const stats = {};
        indices.forEach(idx => {
          if (idx.symbol === 'QQQ') stats.nasdaq = idx;
          if (idx.symbol === 'SPY') stats.sp500 = idx;
        });
        setMarketStats(stats);
        setTopStocks(stocks);
      } catch (e) {
        setErrorStocks('Failed to load stock data');
      } finally {
        setLoadingStocks(false);
      }
    }

    async function fetchCryptos() {
      setLoadingCryptos(true);
      setErrorCryptos(null);
      try {
        const cryptos = await apiService.fetchTopCryptos();
        setTopCryptos(cryptos);
      } catch (e) {
        setErrorCryptos('Failed to load crypto data');
      } finally {
        setLoadingCryptos(false);
      }
    }

    async function fetchCommodities() {
      setLoadingCommodities(true);
      setErrorCommodities(null);
      try {
        const data = await apiService.fetchCommodities();
        setCommodities(data);
      } catch (e) {
        setErrorCommodities('Failed to load commodity data');
      } finally {
        setLoadingCommodities(false);
      }
    }

    async function fetchSentiment() {
      setLoadingSentiment(true);
      setErrorSentiment(null);
      try {
        const data = await apiService.fetchSentiment();
        setSentiment(data);
      } catch (e) {
        setErrorSentiment('Failed to load sentiment data');
      } finally {
        setLoadingSentiment(false);
      }
    }

    async function fetchNews() {
      setLoadingNews(true);
      setErrorNews(null);
      try {
        const data = await apiService.fetchNews();
        setNews(data);
      } catch (e) {
        setErrorNews('Failed to load news');
      } finally {
        setLoadingNews(false);
      }
    }

    fetchStocksAndIndices();
    fetchCryptos();
    fetchCommodities();
    fetchSentiment();
    fetchNews();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>

        {/* US Stock Market Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>US Stock Market</Text>
          {loadingStocks ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : errorStocks ? (
            <Text style={styles.errorText}>{errorStocks}</Text>
          ) : marketStats && (marketStats.nasdaq || marketStats.sp500) ? (
            <View style={styles.statsRow}>
              <View style={styles.statsCol}>
                <Card
                  title={<Text style={[styles.cardTitle, { color: theme.colors.text }]}>NASDAQ</Text>}
                  description={
                    <View>
                      <Text style={[styles.cardValue, { color: theme.colors.text }]}>
                        {marketStats.nasdaq?.price?.toLocaleString?.() ?? '--'}
                      </Text>
                      <Text style={[styles.cardChange, { color: changeColor(marketStats.nasdaq?.changesPercentage) }]}>
                        {marketStats.nasdaq?.changesPercentage !== undefined
                          ? `${marketStats.nasdaq.changesPercentage >= 0 ? '+' : ''}${marketStats.nasdaq.changesPercentage.toFixed(2)}%`
                          : '--'}
                      </Text>
                    </View>
                  }
                  color={colors.secondary}
                />
              </View>
              <View style={styles.statsCol}>
                <Card
                  title={<Text style={[styles.cardTitle, { color: theme.colors.text }]}>S&amp;P 500</Text>}
                  description={
                    <View>
                      <Text style={[styles.cardValue, { color: theme.colors.text }]}>
                        {marketStats.sp500?.price?.toLocaleString?.() ?? '--'}
                      </Text>
                      <Text style={[styles.cardChange, { color: changeColor(marketStats.sp500?.changesPercentage) }]}>
                        {marketStats.sp500?.changesPercentage !== undefined
                          ? `${marketStats.sp500.changesPercentage >= 0 ? '+' : ''}${marketStats.sp500.changesPercentage.toFixed(2)}%`
                          : '--'}
                      </Text>
                    </View>
                  }
                  color={colors.accent}
                />
              </View>
            </View>
          ) : (
            <Text style={styles.errorText}>US index data is currently unavailable. Please try again later.</Text>
          )}
        </View>

        {/* Commodities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Commodities</Text>
          {loadingCommodities ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : errorCommodities || !commodities || commodities.length === 0 ? (
            <Text style={styles.errorText}>Commodity data is currently unavailable. Please try again later.</Text>
          ) : (
            <View style={styles.statsRow}>
              {commodities.map((c) => (
                <View key={c.symbol} style={styles.statsCol}>
                  <Card
                    title={<Text style={[styles.cardTitle, { color: theme.colors.text }]}>{c.name}</Text>}
                    description={
                      <View>
                        <Text style={[styles.cardValue, { color: theme.colors.text, fontSize: 15 }]}>
                          ${c.price?.toLocaleString?.() ?? '--'}
                        </Text>
                        <Text style={[styles.cardChange, { color: changeColor(c.changesPercentage) }]}>
                          {c.changesPercentage >= 0 ? '+' : ''}{c.changesPercentage?.toFixed(2)}%
                        </Text>
                      </View>
                    }
                    color="#f59e0b"
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Top 3 US Stocks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top 3 Performing US Stocks</Text>
          {loadingStocks ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : errorStocks ? (
            <Text style={styles.errorText}>{errorStocks}</Text>
          ) : topStocks && topStocks.length > 0 ? (
            topStocks.map((stock) => (
              <Card
                key={stock.symbol}
                title={`${stock.symbol} - ${stock.name}`}
                description={`$${stock.price?.toLocaleString?.() ?? '--'}  (${stock.changesPercentage >= 0 ? '+' : ''}${stock.changesPercentage != null ? stock.changesPercentage.toFixed(2) + '%' : '--'})`}
                color={theme.colors.primary}
              />
            ))
          ) : (
            <Text style={styles.errorText}>Stock data is currently unavailable. Please try again later.</Text>
          )}
        </View>

        {/* Top 3 Crypto */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top 3 Performing Crypto</Text>
          {loadingCryptos ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : errorCryptos ? (
            <Text style={styles.errorText}>{errorCryptos}</Text>
          ) : topCryptos && topCryptos.length > 0 ? (
            topCryptos.map((crypto) => (
              <Card
                key={crypto.id}
                title={`${crypto.symbol.toUpperCase()} - ${crypto.name}`}
                description={`$${crypto.current_price?.toLocaleString?.() ?? '--'}  (${crypto.price_change_percentage_24h != null ? (crypto.price_change_percentage_24h >= 0 ? '+' : '') + crypto.price_change_percentage_24h.toFixed(2) + '%' : '--'})`}
                color={colors.accent}
              />
            ))
          ) : (
            <Text style={styles.errorText}>Crypto data is currently unavailable. Please try again later.</Text>
          )}
        </View>

        {/* Market Sentiment */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Crypto Market Sentiment</Text>
          {loadingSentiment ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : errorSentiment || !sentiment ? (
            <Text style={styles.errorText}>Sentiment data is currently unavailable. Please try again later.</Text>
          ) : (
            <View style={[styles.sentimentCard, { backgroundColor: theme.colors.surface, borderColor: sentimentColor(sentiment.value) }]}>
              <View style={[styles.sentimentBadge, { backgroundColor: sentimentColor(sentiment.value) }]}>
                <Text style={styles.sentimentScore}>{sentiment.value}</Text>
              </View>
              <View style={styles.sentimentInfo}>
                <Text style={[styles.sentimentLabel, { color: theme.colors.text }]}>{sentiment.value_classification}</Text>
                <Text style={[styles.sentimentSub, { color: theme.colors.textSecondary }]}>Fear &amp; Greed Index</Text>
              </View>
            </View>
          )}
        </View>

        {/* World News */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>World News</Text>
          {loadingNews ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : errorNews || !news || news.length === 0 ? (
            <Text style={styles.errorText}>News is currently unavailable. Please try again later.</Text>
          ) : (
            news.map((item, i) => (
              <Card
                key={i}
                title={item.title}
                description={`${item.source}  ·  ${timeAgo(item.published)}`}
                color="#6366f1"
              />
            ))
          )}
        </View>

      </ScrollView>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  statsCol: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardChange: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  sentimentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    padding: spacing.md,
    gap: spacing.md,
  },
  sentimentBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentimentScore: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  sentimentInfo: {
    flex: 1,
  },
  sentimentLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  sentimentSub: {
    fontSize: 13,
    marginTop: 2,
  },
});
