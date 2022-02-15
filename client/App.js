import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'tailwind-react-native-classnames'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import StartSessionScreen from './screens/StartSessionScreen';
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='HomeScreen' component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name='LoginScreen' component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen options={{ headerShown: false }} name='StartSessionScreen' component={StartSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
