import { AuthProvider } from './AuthContext';
import Router from './Router';


export default function App() {

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}