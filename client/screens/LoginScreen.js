import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
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
      style={tw`bg-gray-100 flex-1 items-center mt-2`}
    >
      <SafeAreaView style={tw`w-4/5 max-w-md mb-4`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Login</Text>

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
          />
        </View>

        <View style={tw`flex-row border-gray-300 border bg-white rounded mb-4`}>
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

        <View>
          <TouchableOpacity
            style={tw`bg-green-600 rounded p-4 mb-3`}
            onPress={handleLogin}
          >
            <Text style={tw`text-center text-white font-bold`}>Login</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity 
            style={tw`bg-green-600 rounded p-4 mb-3`}
            onPress={() => navigation.navigate('SignUpScreen')}
          >
            <Text style={tw`text-center text-white font-bold`}>Don't have an account?</Text>
          </TouchableOpacity>
        </View>       
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
