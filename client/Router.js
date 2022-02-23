import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import { AuthProvider, useAuth } from './AuthContext';
import Loading from './components/Loading';

const Stack = createNativeStackNavigator();

export default function Router() {
  const { currentUser, loading } = useAuth();

  const AppStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='HomeScreen' component={HomeScreen} />
      </Stack.Navigator>
    )
  }

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='LoginScreen' component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name='SignUpScreen' component={SignUpScreen} />
      </Stack.Navigator>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}