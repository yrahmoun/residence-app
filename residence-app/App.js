import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import BottomTabs from './navigation/BottomTabs';
import { initDB } from './database/db';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initDB();
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
