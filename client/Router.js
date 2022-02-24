import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import { useAuth } from './AuthContext';
import Loading from './components/Loading';
import { StartSessionScreen } from './screens/StartSessionScreen';
const Stack = createNativeStackNavigator();

export default function Router() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <>
            <Stack.Screen options={{ headerShown: false }} name='HomeScreen' component={HomeScreen} />
            <Stack.Screen options={{ headerShown: false }} name='StartSessionScreen' component={StartSessionScreen} />
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