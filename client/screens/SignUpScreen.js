import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={tw`flex-1 items-center`}
    >
      <SafeAreaView style={tw`w-4/5`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Register</Text>
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

        <TextInput
          style={tw`bg-white rounded p-3 my-1 border border-gray-300`}
          placeholder='Cofirm Password'
          secureTextEntry
          value={passwordConf}
          onChangeText={text => setPasswordConf(text)}
        />
      </SafeAreaView>
      <View style={tw`bg-indigo-700 rounded p-3 mb-3 w-4/5`}>
        <TouchableOpacity
        >
          <Text style={tw`text-center text-white`}>Signup</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`bg-indigo-700 rounded p-3 mb-3 w-4/5`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={tw`text-center text-white`}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
