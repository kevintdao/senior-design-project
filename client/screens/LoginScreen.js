import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../utils/firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          const user = credential.user;
          console.log(email);
        })
  }

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={tw`flex-1 items-center`}
    >
      <SafeAreaView style={tw`w-4/5`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Login</Text>
        <TextInput
          style={tw`bg-white rounded p-2 my-1 border border-gray-300`}
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
        />
        
        <TextInput
          style={tw`bg-white rounded p-2 my-1 border border-gray-300`}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </SafeAreaView>

      <View style={tw`bg-indigo-700 rounded p-2 mb-2 w-4/5`}>
        <TouchableOpacity
          onPress={handleLogin}
        >
          <Text style={tw`text-center text-white`}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`bg-indigo-700 rounded p-2 mb-2 w-4/5`}>
        <TouchableOpacity 
          style={tw``}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={tw`text-center text-white`}>Register</Text>
        </TouchableOpacity>
      </View>
      
    </KeyboardAvoidingView>
  );
}
