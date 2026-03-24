module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    // This tells Jest to transform react-native, react-navigation, and flash-list
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation|@shopify/flash-list)/',
  ],
  // Tell Jest to run our mocks before executing the test suite!
  setupFiles: ['./jest.setup.js'],
};
