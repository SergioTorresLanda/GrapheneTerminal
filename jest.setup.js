// jest.setup.js

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  
  return {
    __esModule: true,
    // Mock the Animated.View, Animated.Text components
    default: {
      View: View,
      Text: Text,
      ScrollView: ScrollView,
      createAnimatedComponent: jest.fn((component) => component),
    },
    // Mock the hooks your component is trying to use
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    useAnimatedStyle: jest.fn(() => ({})),
    useDerivedValue: jest.fn(() => ({ value: 0 })),
    withTiming: jest.fn((toValue) => toValue),
    withSpring: jest.fn((toValue) => toValue),
    withDelay: jest.fn((delay, animation) => animation),
    withSequence: jest.fn(() => ({})),
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
  };
});

// 3. Intercept the TurboModule Registry to mock custom native binaries
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const originalRegistry = jest.requireActual('react-native/Libraries/TurboModule/TurboModuleRegistry');
  
  return {
    ...originalRegistry,
    getEnforcing: (name) => {
      // When the system asks for your custom trading engine, hand it a dummy
      if (name === 'GrapheneCore') {
        return {
          // If your UI explicitly calls functions on GrapheneCore during render,
          // you must mock them here. For example:
          // connectEngine: jest.fn(),
          // processTrade: jest.fn(),
        };
      }
      // For all other native modules, behave normally
      return originalRegistry.getEnforcing(name);
    },
    get: (name) => {
      if (name === 'GrapheneCore') {
        return {};
      }
      return originalRegistry.get(name);
    }
  };
});