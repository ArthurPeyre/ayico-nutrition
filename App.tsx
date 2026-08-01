import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type ApiState =
  | { kind: 'loading' }
  | { kind: 'ok'; status: string }
  | { kind: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<ApiState>({ kind: 'loading' });

  const checkHealth = useCallback(async () => {
    setState({ kind: 'loading' });
    try {
      const response = await fetch(`${API_URL}/health`);
      const body = await response.json();
      setState({ kind: 'ok', status: body.status ?? 'inconnu' });
    } catch (error) {
      setState({ kind: 'error', message: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.url}>{API_URL ?? 'EXPO_PUBLIC_API_URL non definie'}</Text>

      {state.kind === 'loading' && <ActivityIndicator />}
      {state.kind === 'ok' && <Text style={styles.ok}>API status: {state.status}</Text>}
      {state.kind === 'error' && <Text style={styles.error}>Erreur: {state.message}</Text>}

      <Button title="Reessayer" onPress={checkHealth} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  url: {
    color: '#666',
  },
  ok: {
    color: 'green',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
