import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'tailwind-react-native-classnames'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './AuthContext';
import Router from './Router';


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}