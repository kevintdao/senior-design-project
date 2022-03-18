import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import tw from 'twrnc'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { useAuth } from '../AuthContext'

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAuth();

  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState({});

  const handleSubmit = async () => {
    if(!currPassword || !newPassword || !passwordConf){
      return setAlert({
        type: "warning",
        text: "Password field(s) is/are empty!"
      })
    }

    if(newPassword != passwordConf){
      return setAlert({
        type: "warning",
        text: "Passwords do not match!"
      })
    }

    if(newPassword.length < 6){
      return setAlert({
        type: "warning",
        text: "Password should be at least 6 characters!"
      })
    }

    setLoading(true);
    try{
      await changePassword(currPassword, newPassword);
      setSuccess(true);
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

  if (success) {
    return (
      <SafeAreaView style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-5 text-center`}>Successful!</Text>
        <View style={tw`w-4/5 max-w-md`}>
          <TouchableOpacity
            style={tw`bg-green-600 rounded p-3 mb-3`}
            onPress={() => navigation.navigate('SettingScreen')}
          >
            <Text style={tw`text-center text-white`}>Back to Settings</Text>
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
      <SafeAreaView style={tw.style(`w-4/5 max-w-md`)}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5`}>Change Password</Text>

        {Object.keys(alert).length === 0 ? undefined : <Alert type={alert.type} text={alert.text}/>}

        <View style={tw`flex-row border-gray-300 border bg-white rounded mb-3`}>
          <View style={tw`justify-center items-center border-r border-gray-300 w-1/8`}>
            <AntDesign name='lock' size={22}/>
          </View>
          <TextInput
            style={tw`p-4 w-7/8`}
            placeholder='Current Password'
            secureTextEntry
            value={currPassword}
            onChangeText={text => setCurrPassword(text)}
          />
        </View> 

        <View style={tw`flex-row border-gray-300 border bg-white rounded mb-3`}>
          <View style={tw`justify-center items-center border-r border-gray-300 w-1/8`}>
            <AntDesign name='lock' size={22}/>
          </View>
          <TextInput
            style={tw`p-4 w-7/8`}
            placeholder='New Password'
            secureTextEntry
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
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
            onPress={handleSubmit}
          >
            <Text style={tw`text-center text-white font-bold`}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}