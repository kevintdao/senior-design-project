import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { AntDesign } from '@expo/vector-icons';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { useAuth } from '../AuthContext';

export default function SignUpScreen ({ navigation }) {
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
        <View style={tw`w-4/5 max-w-md`}>
          <TouchableOpacity
            style={tw`bg-green-600 rounded p-3 mb-3`}
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
      style={tw`flex-1 items-center bg-gray-100 mt-2`}
    >
      <SafeAreaView style={tw`w-4/5 max-w-md mb-4`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Register</Text>

        {Object.keys(alert).length === 0 ? undefined : <Alert type={alert.type} text={alert.text}/>}

        <View style={tw`flex-row border-gray-300 border bg-white rounded mb-3`}>
          <View style={tw`justify-center items-center border-r border-gray-300 w-1/8`}>
            <AntDesign name='user' size={22} />
          </View>
          <TextInput
            style={tw`p-4 w-7/8`}
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text)}
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
        
        <View style={tw`flex-row border-gray-300 border bg-white rounded mb-3`}>
          <View style={tw`justify-center items-center border-r border-gray-300 w-1/8`}>
            <AntDesign name='lock' size={22}/>
          </View>
          <TextInput
            style={tw`p-4 w-7/8`}
            placeholder='Password'
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View> 

        <View style={tw`flex-row border-gray-300 border bg-white rounded mb-4`}>
          <View style={tw`justify-center items-center border-r border-gray-300 w-1/8`}>
            <AntDesign name='lock' size={22}/>
          </View>
          <TextInput
            style={tw`p-4 w-7/8`}
            placeholder='Confirm Password'
            secureTextEntry
            value={passwordConf}
            onChangeText={text => setPasswordConf(text)}
          />
        </View>

        <View>
          <TouchableOpacity
            style={tw`bg-green-600 rounded p-4 mb-3`}
            onPress={handleSignup}
          >
            <Text style={tw`text-center text-white font-bold`}>Signup</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            style={tw`bg-green-600 rounded p-4 mb-3`}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={tw`text-center text-white font-bold`}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
