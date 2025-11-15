
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/ui';
import { colors, spacing } from '../../src/constants';
import { apiService } from '../../src/services/api';



export default function HubScreen() {
  // State for stocks and indices
  const [marketStats, setMarketStats] = useState(null);
  const [topStocks, setTopStocks] = useState(null);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [errorStocks, setErrorStocks] = useState(null);

  // State for crypto
  const [topCryptos, setTopCryptos] = useState(null);
  const [loadingCryptos, setLoadingCryptos] = useState(true);
  const [errorCryptos, setErrorCryptos] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoadingStocks(true);
      setErrorStocks(null);
      try {
        const [indices, stocks] = await Promise.all([
          apiService.fetchUSIndices(),
          apiService.fetchTopUSStocks(),
        ]);
        // Indices: Alpha Vantage returns SPY (S&P 500) and QQQ (NASDAQ)
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
    fetchData();
    fetchCryptos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hub</Text>
      {/* <Text style={styles.subtitle}>Your central dashboard for quick insights.</Text> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>US Stock Market Overview</Text>
        {loadingStocks ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.lg }} />
        ) : errorStocks ? (
          <Text style={{ color: colors.error, textAlign: 'center' }}>{errorStocks}</Text>
        ) : marketStats && (marketStats.nasdaq || marketStats.sp500) ? (
          <View style={styles.statsRow}>
            <View style={styles.statsCol}>
              <Card
                title={<Text style={styles.cardTitle}>NASDAQ</Text>}
                description={
                  <View>
                    <Text style={styles.cardValue}>
                      {marketStats.nasdaq?.price?.toLocaleString?.() ?? 'Data unavailable'}
                    </Text>
                    <Text style={styles.cardChange}>
                      {marketStats.nasdaq?.changesPercentage !== undefined
                        ? `${marketStats.nasdaq.changesPercentage.toFixed(2)}%`
                        : 'Data unavailable'}
                    </Text>
                  </View>
                }
                color={colors.secondary}
              />
            </View>
            <View style={styles.statsCol}>
              <Card
                title={<Text style={styles.cardTitle}>S&amp;P 500</Text>}
                description={
                  <View>
                    <Text style={styles.cardValue}>
                      {marketStats.sp500?.price?.toLocaleString?.() ?? 'Data unavailable'}
                    </Text>
                    <Text style={styles.cardChange}>
                      {marketStats.sp500?.changesPercentage !== undefined
                        ? `${marketStats.sp500.changesPercentage.toFixed(2)}%`
                        : 'Data unavailable'}
                    </Text>
                  </View>
                }
                color={colors.accent}
              />
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.error, textAlign: 'center', marginVertical: spacing.md }}>
            US index data is currently unavailable. Please try again later.
          </Text>
        )}
      </View>

      {/* Crypto Market Overview will be implemented with live data next */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 3 Performing US Stocks</Text>
        {loadingStocks ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.lg }} />
        ) : errorStocks ? (
          <Text style={{ color: colors.error, textAlign: 'center' }}>{errorStocks}</Text>
        ) : topStocks && topStocks.length > 0 ? (
          topStocks.map((stock) => (
            <Card
              key={stock.symbol}
              title={`${stock.symbol} - ${stock.name}`}
              description={`$${stock.price?.toLocaleString?.() ?? '--'}  (${stock.changesPercentage ? stock.changesPercentage.toFixed(2) + '%' : '--'})`}
              color={colors.primary}
            />
          ))
        ) : (
          <Text style={{ color: colors.error, textAlign: 'center', marginVertical: spacing.md }}>
            Stock data is currently unavailable. Please try again later.
          </Text>
        )}
      </View>

      {/* Top 3 Performing Crypto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 3 Performing Crypto</Text>
        {loadingCryptos ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.lg }} />
        ) : errorCryptos ? (
          <Text style={{ color: colors.error, textAlign: 'center' }}>{errorCryptos}</Text>
        ) : topCryptos && topCryptos.length > 0 ? (
          topCryptos.map((crypto) => (
            <Card
              key={crypto.id}
              title={`${crypto.symbol.toUpperCase()} - ${crypto.name}`}
              description={`$${crypto.current_price?.toLocaleString?.() ?? '--'}  (${crypto.price_change_percentage_24h !== undefined ? crypto.price_change_percentage_24h.toFixed(2) + '%' : '--'})`}
              color={colors.accent}
            />
          ))
        ) : (
          <Text style={{ color: colors.error, textAlign: 'center', marginVertical: spacing.md }}>
            Crypto data is currently unavailable. Please try again later.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'stretch',
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
  },
  cardChange: {
    fontSize: 14,
    color: colors.accentDark,
    marginTop: 2,
  },
});
