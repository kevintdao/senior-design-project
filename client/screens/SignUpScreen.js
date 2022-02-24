import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { useAuth } from '../AuthContext';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [alert, setAlert] = useState({});

  const handleSignup = async () => {
    if(!email){
      return setAlert({
        type: "warning",
        text: "Email is empty!"
      })
    }

    if(!password || !passwordConf){
      return setAlert({
        type: "warning",
        text: "Password field(s) is/are empty!"
      })
    }

    if(password != passwordConf){
      return setAlert({
        type: "warning",
        text: "Passwords do not match!"
      })
    }

    if(password.length < 6){
      return setAlert({
        type: "warning",
        text: "Password should be at least 6 characters!"
      })
    }

    setLoading(true);
    try{
      await signup(email, password);
      setRegistered(true);
    } catch(error) {
      setAlert({
        type: "error",
        text: error.message
      });
    }
    setLoading(false);
  }

  if (loading) {
    return <Loading />
  }

  if (registered) {
    return (
      <SafeAreaView style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-5 text-center`}>Registration Successful!</Text>
        <View style={tw`bg-indigo-700 rounded p-3 mb-3 w-4/5`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={tw`text-center text-white`}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={tw`flex-1 items-center bg-gray-100`}
    >
      <SafeAreaView style={tw`w-4/5`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Register</Text>

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
          onPress={handleSignup}
        >
          <Text style={tw`text-center text-white text-lg`}>Signup</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`bg-indigo-700 rounded p-3 mb-3 w-4/5`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={tw`text-center text-white text-lg`}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
