import { StatusBar } from 'react-native';
import { AuthProvider } from './AuthContext';
import Router from './Router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle='dark-content' />
        <Router />
      </AuthProvider>
    </SafeAreaProvider>
  );
}