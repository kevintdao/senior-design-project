import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout().then(() =>{
      navigation.navigate('LoginScreen');
    });
  }

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100 mt-2`}>
      <View style={tw.style(`w-4/5 max-w-md`, styles.container)}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5`}>Settings</Text>

        <View>
          <View>
            <TouchableOpacity style={tw.style(`bg-green-800 items-center rounded p-3 mb-2 flex-row`)}
              onPress={handleLogout}
            >
              <View style={tw`mr-4`}>
                <Ionicons name='ios-log-out' size={22} color='white'/>
              </View>
              <View style={tw`w-6/8 items-center`}>
                <Text style={tw`text-white text-lg`}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 25,
  }
})