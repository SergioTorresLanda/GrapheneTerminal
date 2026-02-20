import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const ProfileScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name: NEO</Text>
      <Text style={styles.text}>Role: Senior iOS Architect</Text>
      <Text style={styles.text}>Status: Ready</Text>

      {/* The backward navigation trigger */}
      <View style={{ marginTop: 40 }}>
        <Button 
          title="Return to Terminal" 
          color="#00FF00" 
          onPress={() => navigation.goBack()} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  text: { color: 'white', fontSize: 20, fontFamily: 'Courier', marginVertical: 5 }
});