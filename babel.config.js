module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }], //For Offline-First capability !
    'react-native-reanimated/plugin' 
  ],
};
