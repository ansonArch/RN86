import { handleExpoUpdates, handleExpoUpdatesGroupId } from '@utils/expoUpdatesUtils';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, AppState, NativeEventSubscription, AppStateStatus } from 'react-native';

let handleStateChangeListener: NativeEventSubscription | undefined;

export default function App() {
  const[appState, setAppState] = useState('active');

   async function initDbAndStaticData() {
    handleExpoUpdatesGroupId();
  };

  async function _handleAppStateChange (nextAppState: AppStateStatus) {
     if (appState.match(/inactive|background/) && nextAppState === 'active') {
       await Updates.reloadAsync();
     }
     setAppState(nextAppState);
  };

  useEffect(() => {
    handleStateChangeListener = AppState.addEventListener('change', _handleAppStateChange);
    handleExpoUpdates(initDbAndStaticData);

    return handleStateChangeListener?.remove();
  }, []);


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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
  },
});
