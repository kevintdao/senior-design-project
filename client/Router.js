import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import StartSessionScreen from './screens/StartSessionScreen';
import SessionSelectScreen from './screens/SessionSelectScreen';
import GraphScreen from './screens/GraphScreen';
import NewSessionScreen from './screens/NewSessionScreen';
import { useAuth } from './AuthContext';
import Loading from './components/Loading';
import SettingScreen from './screens/SettingScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const DataStack = createNativeStackNavigator();
const SettingStack = createNativeStackNavigator();

export default function Router() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />
  }

  const HomeStackNavigator = ({ navigation, routes }) => (
    <HomeStack.Navigator>
      <HomeStack.Screen options={{ headerShown: false }} name='HomeScreen' component={HomeScreen} />
      <HomeStack.Screen options={{ headerShown: false }} name='StartSessionScreen' component={StartSessionScreen} />
      <HomeStack.Screen options={{ headerShown: false }} name='NewSessionScreen' component={NewSessionScreen} />
    </HomeStack.Navigator>
  )

  const DataStackNavigator = ({ navigator, routes }) => (
    <DataStack.Navigator>
      <DataStack.Screen options={{ headerShown: false }} name='SessionSelectScreen' component={SessionSelectScreen} />
      <DataStack.Screen options={{ headerShown: false }} name='GraphScreen' component={GraphScreen} />
    </DataStack.Navigator>
  )

  const SettingStackNavigator = ({ navigator, routes }) => (
    <SettingStack.Navigator>
      <SettingStack.Screen options={{ headerShown: false }} name='SettingScreen' component={SettingScreen} />
      <SettingStack.Screen options={{ headerShown: false }} name='ChangePasswordScreen' component={ChangePasswordScreen} />
    </SettingStack.Navigator>
  )

  const HomeTab = () => {
    return (
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch(route.name){
              case 'Home':
                iconName = 'ios-home'
                break;
              case 'Data':
                iconName = 'ios-analytics'
                break;
              case 'Settings':
                iconName = 'ios-settings'
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Data" component={DataStackNavigator} />
        <Tab.Screen name="Settings" component={SettingStackNavigator} />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <>
            <Stack.Screen options={{ headerShown: false }} name='HomeScreen' component={HomeTab} />
          </>
        ) : (
          <>
            <Stack.Screen options={{ headerShown: false }} name='LoginScreen' component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name='SignUpScreen' component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}