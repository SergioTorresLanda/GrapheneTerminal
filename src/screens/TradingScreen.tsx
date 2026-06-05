import React, { useState } from 'react';
import Config from "react-native-config";
import { LiveAssetTicker } from '../components/LiveAssetTicker';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image,
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';

const ICON_MAP = {
  'BTC': require('../assets/btc.png'),
  'ETH': require('../assets/eth.png'),
  'SOL': require('../assets/sol.png'),
  'XRP': require('../assets/xrp.png'),
  'DOGE': require('../assets/doge.png'),
  'ADA': require('../assets/ada.png'),
  'BCH': require('../assets/bch.png'),
  'BNB': require('../assets/bnb.png'),
  'TON': require('../assets/ton.png'),
  'TRON': require('../assets/trx.png'),
  'XMR': require('../assets/xmr.png'),
  'SUI': require('../assets/sui.png')
};
// POST Request
const baseUrl = Config.API_URL || '';
const apiUrl = baseUrl ? `${baseUrl}/api/v1/trades` : '';
// 1. Static mock prices for immediate execution
const MOCK_PRICES = {
  BTC: 68500.20, ETH: 3750.50, SOL: 165.30, ADA: 0.45, 
  BCH: 450.00, DOGE: 0.16, TON: 6.20, XRP: 0.52, 
  BNB: 610.00, TRON: 0.11, SUI: 2.45, XMR: 145.80
};

const AVAILABLE_PAIRS = Object.keys(MOCK_PRICES);

export const TradingScreen = () => {
  const [selectedPair, setSelectedPair] = useState('BTC');
  const [nominalValue, setNominalValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  // 2. Strict Input Validation ($10 - $10,000)
  const handleAmountChange = (text) => {
    // Strip non-numeric characters (allow one decimal point)
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    if ((cleaned.match(/\./g) || []).length > 1) return;
    
    setNominalValue(cleaned);

    const value = parseFloat(cleaned);
    if (cleaned.length > 0) {
      if (value < 10) {
        setValidationError('Minimum order is $10');
      } else if (value > 10000) {
        setValidationError('Maximum order is $10,000');
      } else {
        setValidationError('');
      }
    } else {
      setValidationError('');
    }
  };

  const isFormValid = () => {
    const value = parseFloat(nominalValue);
    return value >= 10 && value <= 10000 && !validationError;
  };

  // 3. Execution Handler
  const handleTrade = async (side) => {
    if (!isFormValid()) return;
    
    const price = MOCK_PRICES[selectedPair];
    const amount = parseFloat(nominalValue);
    const cryptoAmount = (amount / price).toFixed(6);

    // In a real scenario, this dispatches a POST request to your Go backend
    setIsProcessing(true);
  
    try {
     //const apiUrl = Platform.OS === 'android' 
       // ? 'http://10.0.2.2:8080/api/v1/trades' 
        //: 'http://localhost:8080/api/v1/trades';
                console.log("--- DEBUGGING URL ---");
        console.log("TradeScreen URL :", apiUrl );

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: selectedPair,
          price: price,
          amount: amount,
          total: 10,
          side: side, 
        }),
      });

      if (!response.ok) {
        throw new Error('Trade execution failed');
      }
      //console.log(`[Uplink] ${side.toUpperCase()} order transmitted successfully.`);
    } catch (error) {
      console.error('[Uplink Error] Signal failed:', error);
    } finally {
      setIsProcessing(false);
       Alert.alert(
      'Order Executed',
      `Successfully placed a ${side} order for ${cryptoAmount} ${selectedPair} at $${price} per unit.\n\nTotal: $${amount}`,
      [{ text: 'OK', onPress: () => setNominalValue('') }]
    );
    }
  };

  // We use state to disable the buttons and show a spinner while the network works
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.headerTitle}>Spot Trade</Text>

        {/* Asset Picker Trigger */}
        <Text style={styles.label}>Asset Pair</Text>
        <TouchableOpacity 
          style={styles.pickerTrigger} 
          onPress={() => setIsPickerVisible(true)}
        >
          <Text style={styles.pickerText}>{selectedPair} / USD</Text>
          <Text style={styles.pickerPrice}>Price: ${MOCK_PRICES[selectedPair].toLocaleString()}</Text>
        </TouchableOpacity>

        <LiveAssetTicker 
          selectedPair={selectedPair} 
          initialPrice={MOCK_PRICES[selectedPair]} 
        />

        {/* Nominal Value Input */}
        <Text style={styles.label}>Nominal Value (USD)</Text>
        <TextInput
          style={[styles.input, validationError ? styles.inputError : null]}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#666"
          value={nominalValue}
          onChangeText={handleAmountChange}
          returnKeyType="done"
        />
        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        {isProcessing ? (
          <ActivityIndicator size="large" color="#00FF41" />
        ) : (
    <>
        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.buyButton, !isFormValid() && styles.disabledButton]}
            disabled={!isFormValid()}
            onPress={() => handleTrade('buy')}
          >
            <Text style={styles.buttonText}>Buy {selectedPair}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.sellButton, !isFormValid() && styles.disabledButton]}
            disabled={!isFormValid()}
            onPress={() => handleTrade('sell')}
          >
            <Text style={styles.buttonText}>Sell {selectedPair}</Text>
          </TouchableOpacity>
        </View>
        </>
         )}
      </View>

      {/* Custom Asset Picker Modal */}
      <Modal visible={isPickerVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Asset</Text>
            <FlatList
              data={AVAILABLE_PAIRS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedPair(item);
                    setIsPickerVisible(false);
                  }}
                >
                  <Image 
                    source={ICON_MAP[item]} 
                    style={styles.modalItemIcon} 
                    resizeMode="contain"
                  />
                  <Text style={styles.modalItemText}>{item}</Text>
                  <View></View>
                  <Text style={styles.modalItemPrice}>${MOCK_PRICES[item].toLocaleString()}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setIsPickerVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Kraken Pro Dark Theme feel
  },
  formContainer: {
    padding: 20,
    marginTop: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pickerTrigger: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  pickerPrice: {
    color: '#00C853',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    fontSize: 24,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#00C853', // Kraken Green
    marginRight: 10,
  },
  sellButton: {
    backgroundColor: '#FF3B30', // Kraken Red
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  modalItemText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalItemPrice: {
    color: '#888',
    fontSize: 16,
  },
  modalCancel: {
    padding: 20,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalItemIcon: {
    width: 24,
    height: 24,
    marginRight: 0, // Adds space between image and text
  },
});