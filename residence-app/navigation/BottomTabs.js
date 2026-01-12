import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SearchScreen from '../screens/SearchScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F1F23',
          borderTopWidth: 0,
          elevation: 0,
          height: 95,
          paddingBottom: 20, // enough space above system nav
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === 'Recherche') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Enregistrement') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        // ⬇️ fix white space on keyboard open (Android)
        keyboardHidesTabBar: true,
      })}
    >
      <Tab.Screen name="Recherche" component={SearchScreen} />
      <Tab.Screen name="Enregistrement" component={RegisterScreen} />
    </Tab.Navigator>
  );
}
