
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/ui';
import { colors, spacing } from '../../src/constants';

export default function HubScreen() {
  // Mock data for top 3 US stocks and market stats
  const topStocks = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 650.12,
      change: '+3.2%',
      color: colors.accent,
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 195.34,
      change: '+2.1%',
      color: colors.primary,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 410.56,
      change: '+1.8%',
      color: colors.secondary,
    },
  ];

  const marketStats = {
    nasdaq: { value: 15800.45, change: '+1.2%' },
    sp500: { value: 4700.23, change: '+1.0%' },
  };


  // Mock data for top 2 cryptocurrencies
  const cryptoStats = {
    btc: { name: 'Bitcoin', symbol: 'BTC', value: 37000.12, change: '+2.5%', color: colors.accent },
    eth: { name: 'Ethereum', symbol: 'ETH', value: 2100.45, change: '+1.8%', color: colors.secondary },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hub</Text>
      {/* <Text style={styles.subtitle}>Your central dashboard for quick insights.</Text> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>US Stock Market Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsCol}>
            <Card
              title={<Text style={styles.cardTitle}>NASDAQ</Text>}
              description={
                <View>
                  <Text style={styles.cardValue}>{marketStats.nasdaq.value.toLocaleString()}</Text>
                  <Text style={styles.cardChange}>{marketStats.nasdaq.change}</Text>
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
                  <Text style={styles.cardValue}>{marketStats.sp500.value.toLocaleString()}</Text>
                  <Text style={styles.cardChange}>{marketStats.sp500.change}</Text>
                </View>
              }
              color={colors.accent}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crypto Market Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsCol}>
            <Card
              title={<Text style={styles.cardTitle}>BTC - Bitcoin</Text>}
              description={
                <View>
                  <Text style={styles.cardValue}>${cryptoStats.btc.value.toLocaleString()}</Text>
                  <Text style={styles.cardChange}>{cryptoStats.btc.change}</Text>
                </View>
              }
              color={cryptoStats.btc.color}
            />
          </View>
          <View style={styles.statsCol}>
            <Card
              title={<Text style={styles.cardTitle}>ETH - Ethereum</Text>}
              description={
                <View>
                  <Text style={styles.cardValue}>${cryptoStats.eth.value.toLocaleString()}</Text>
                  <Text style={styles.cardChange}>{cryptoStats.eth.change}</Text>
                </View>
              }
              color={cryptoStats.eth.color}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 3 Performing US Stocks</Text>
        {topStocks.map((stock) => (
          <Card
            key={stock.symbol}
            title={`${stock.symbol} - ${stock.name}`}
            description={`$${stock.price.toFixed(2)}  (${stock.change})`}
            color={stock.color}
          />
        ))}
      </View>

      {/* Top 3 Performing Crypto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 3 Performing Crypto</Text>
        {/* Mock data for top 3 cryptos */}
        {[
          { symbol: 'BTC', name: 'Bitcoin', price: 37000.12, change: '+2.5%', color: colors.accent },
          { symbol: 'ETH', name: 'Ethereum', price: 2100.45, change: '+1.8%', color: colors.secondary },
          { symbol: 'SOL', name: 'Solana', price: 58.23, change: '+4.1%', color: colors.primary },
        ].map((crypto) => (
          <Card
            key={crypto.symbol}
            title={`${crypto.symbol} - ${crypto.name}`}
            description={`$${crypto.price.toLocaleString()}  (${crypto.change})`}
            color={crypto.color}
          />
        ))}
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
