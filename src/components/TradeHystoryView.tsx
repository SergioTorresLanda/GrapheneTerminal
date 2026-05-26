import { useTradeHistory } from '../hooks/useTradeHistory'; 
import { StyleSheet, View, Text, ActivityIndicator, Button , Platform} from 'react-native';
import { FlashList } from '@shopify/flash-list';

export const TradeHistoryView = () => {
  const { trades, isLoading, isRefetching } = useTradeHistory();

  if (isLoading) return <Text style={styles.loading}>SYNCING_LEDGER...</Text>;

  return (
    <View style={{ flex: 1 }}>
      {isRefetching && <Text style={styles.tiny}>Updating...</Text>}
      <FlashList
        data={trades}
        estimatedItemSize={50}
        renderItem={({ item }) => (
          <View style={styles.row}>
             <Text style={styles.text}>{item.symbol} - {item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Pure black for OLED efficiency
    paddingHorizontal: 16,
  },
  loading: {
    color: '#00FF00',
    fontFamily: 'Courier',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 2,
  },
  tiny: {
    color: '#004400', // Dimmer green for background activity
    fontSize: 10,
    fontFamily: 'Courier',
    textAlign: 'right',
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#111', // Subtle separator
  },
  symbolContainer: {
    flex: 1,
  },
  symbolText: {
    color: '#FFF',
    fontFamily: 'Courier',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestampText: {
    color: '#444',
    fontSize: 10,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  dataContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: '600',
  },
  amountText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  // Side-specific colors
  buy: {
    color: '#00FF00', // Graphene Green
  },
  sell: {
    color: '#FF0055', // Graphene Red/Pink
  },
  listContent: {
    paddingBottom: 40, // Space for the bottom of the list
  }
});
