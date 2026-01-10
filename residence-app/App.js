import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import BottomTabs from './navigation/BottomTabs';
import ResidentDetailScreen from './screens/ResidentDetailScreen';
import { initDB } from './database/db';

const Stack = createNativeStackNavigator();

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
      <Stack.Navigator>
        {/* Bottom tabs as the main screen */}
        <Stack.Screen
          name="HomeTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* Resident detail page */}
        <Stack.Screen
          name="ResidentDetail"
          component={ResidentDetailScreen}
          options={{ title: 'Détails du résident' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
