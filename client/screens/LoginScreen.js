import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setAlert({});

    if(!email){
      return setAlert({
        type: "warning",
        text: "Email is empty!"
      })
    }

    if(!password){
      return setAlert({
        type: "warning",
        text: "Password is empty!"
      })
    }

    // check login with firebase
    setLoading(true);
    try{
      await login(email, password);
    } catch(error) {
      setAlert({
        type: "error",
        text: error.message
      });
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={tw`flex-1 items-center`}
    >
      <SafeAreaView style={tw`w-4/5`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Login</Text>

        {Object.keys(alert).length === 0 ? undefined : <Alert type={alert.type} text={alert.text}/>}

        <TextInput
          style={tw`bg-white rounded p-3 my-1 border border-gray-300`}
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
        />
        
        <TextInput
          style={tw`bg-white rounded p-3 my-1 border border-gray-300`}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </SafeAreaView>

      <View style={tw`bg-indigo-700 rounded p-3 mb-3 w-4/5`}>
        <TouchableOpacity
          onPress={handleLogin}
        >
          <Text style={tw`text-center text-white`}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`bg-indigo-700 rounded p-3 mb-3 w-4/5`}>
        <TouchableOpacity 
          style={tw``}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={tw`text-center text-white`}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
      
    </KeyboardAvoidingView>
  );
}
