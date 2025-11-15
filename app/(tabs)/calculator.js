import { colors } from '@/src/constants';
import { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumberPress = (num) => {
    if (shouldResetDisplay) {
      setDisplay(String(num));
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleOperationPress = (op) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculateResult();
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculateResult = () => {
    const current = parseFloat(display);
    const previous = previousValue;

    switch (operation) {
      case '+':
        return previous + current;
      case '-':
        return previous - current;
      case '×':
        return previous * current;
      case '÷':
        return current !== 0 ? previous / current : 0;
      default:
        return current;
    }
  };

  const handleEqualsPress = () => {
    if (operation && previousValue !== null) {
      const result = calculateResult();
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const Button = ({ text, onPress, type = 'number', span = false }) => {
    let buttonStyle = [styles.button];
    let textStyle = [styles.buttonText];

    if (type === 'operator') {
      buttonStyle.push(styles.operatorButton);
      if (operation === text) {
        buttonStyle.push(styles.operatorButtonActive);
      }
      textStyle.push(styles.operatorText);
    } else if (type === 'function') {
      buttonStyle.push(styles.functionButton);
      textStyle.push(styles.functionText);
    } else if (type === 'equals') {
      buttonStyle.push(styles.equalsButton);
      textStyle.push(styles.equalsText);
    }

    if (span) {
      buttonStyle.push(styles.buttonSpan);
    }

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
        {operation && previousValue !== null && (
          <Text style={styles.operationText}>
            {previousValue} {operation}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <Button text="C" onPress={handleClear} type="function" />
          <Button text="±" onPress={handleToggleSign} type="function" />
          <Button text="%" onPress={handlePercentage} type="function" />
          <Button text="÷" onPress={() => handleOperationPress('÷')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button text="7" onPress={() => handleNumberPress(7)} />
          <Button text="8" onPress={() => handleNumberPress(8)} />
          <Button text="9" onPress={() => handleNumberPress(9)} />
          <Button text="×" onPress={() => handleOperationPress('×')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button text="4" onPress={() => handleNumberPress(4)} />
          <Button text="5" onPress={() => handleNumberPress(5)} />
          <Button text="6" onPress={() => handleNumberPress(6)} />
          <Button text="-" onPress={() => handleOperationPress('-')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button text="1" onPress={() => handleNumberPress(1)} />
          <Button text="2" onPress={() => handleNumberPress(2)} />
          <Button text="3" onPress={() => handleNumberPress(3)} />
          <Button text="+" onPress={() => handleOperationPress('+')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button text="0" onPress={() => handleNumberPress(0)}  />
          <Button text="." onPress={handleDecimal} />
          <Button text="=" onPress={handleEqualsPress} type="equals" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 24,
    paddingBottom: 16,
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  displayText: {
    fontSize: 64,
    fontWeight: '300',
    color: colors.gray[900],
  },
  operationText: {
    fontSize: 24,
    color: colors.gray[500],
    marginTop: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  buttonSpan: {
    flex: 2,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '400',
    color: colors.gray[900],
  },
  functionButton: {
    backgroundColor: colors.gray[200],
  },
  functionText: {
    color: colors.gray[900],
    fontSize: 28,
  },
  operatorButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  operatorButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  operatorText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '500',
  },
  equalsButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  equalsText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '500',
  },
});
