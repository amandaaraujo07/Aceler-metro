import React, { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, StatusBar, Dimensions, Platform } from 'react-native';

type Subscription = {
  remove: () => void;
};

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const _subscribe = () => {
    try {
      const sub = Accelerometer.addListener(setData);
      setSubscription(sub);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        'Falha ao iniciar o acelerômetro: ' + (error?.message || String(error)),
        [{ text: 'OK' }]
      );
    }
  };

  const _unsubscribe = () => {
    subscription?.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const toggle = () => {
    subscription ? _unsubscribe() : _subscribe();
  };

  const updateIntervalSetting = (newInterval: number) => {
    Accelerometer.setUpdateInterval(newInterval);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.title}>Acelerômetro</Text>

        <View style={styles.dataBox}>
          <Text style={styles.dataText}>x: {data.x.toFixed(3)}</Text>
          <Text style={styles.dataText}>y: {data.y.toFixed(3)}</Text>
          <Text style={styles.dataText}>z: {data.z.toFixed(3)}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={toggle}>
          <Text style={styles.buttonText}>
            {subscription ? 'Parar' : 'Iniciar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.intervalContainer}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => updateIntervalSetting(1000)}
          >
            <Text style={styles.buttonText}>1s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => updateIntervalSetting(500)}
          >
            <Text style={styles.buttonText}>500ms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => updateIntervalSetting(100)}
          >
            <Text style={styles.buttonText}>100ms</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  dataBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: width * 0.8,
  },
  dataText: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  button: {
    backgroundColor: '#764ba2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  intervalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  smallButton: {
    backgroundColor: '#764ba2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
