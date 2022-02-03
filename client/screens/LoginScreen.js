import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={tw`flex-1 justify-center items-center`}
    >
      <SafeAreaView style={tw`w-4/5`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Login</Text>
        <TextInput
          style={tw`bg-white rounded p-2 my-1 border border-gray-300`}
          placeholder='Email'
        />
        
        <TextInput
          style={tw`bg-white rounded p-2 my-1 border border-gray-300`}
          placeholder='Password'
          secureTextEntry
        />
      </SafeAreaView>

      <View style={tw`bg-blue-200 rounded p-2 mb-2 w-1/2`}>
        <TouchableOpacity>
          <Text style={tw`text-center`}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`bg-blue-200 rounded p-2 mb-2 w-1/2`}>
        <TouchableOpacity style={tw``}>
          <Text style={tw`text-center`}>Register</Text>
        </TouchableOpacity>
      </View>
      
    </KeyboardAvoidingView>
  );
}
