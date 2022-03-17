import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useAuth } from '../AuthContext';

const HomeScreen = ( ) => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const user = currentUser.user;
  const email = user.email;
  
  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100 mt-2`}>
      <View style={tw`w-4/5 max-w-md`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5 text-center`}>Home</Text>
        <Text style={tw`text-xl text-gray-900 mb-5 text-center`}>
          <Text style={tw`font-bold`}>Logged in as: </Text>
          <Text>{email}</Text>
        </Text>
      
        <View style={tw`mt-5`}> 
          <View>
            <TouchableOpacity 
              style={tw`bg-green-600 mb-3 items-center rounded p-3`}
              onPress={() => navigation.navigate('StartSessionScreen')}
            >
              <Text style={tw`text-white text-lg`}>Begin New Session</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={tw`bg-green-600 mb-3 items-center rounded p-3`}>
              <Text style={tw`text-white text-lg`}>Sensor Testing</Text>
            </TouchableOpacity>
          </View>


          <View style={tw`mt-6`}>
            <View >
              <TouchableOpacity style={tw`bg-green-800 items-center rounded p-3 mb-3`}>
                <Text style={tw`text-white text-lg`}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
    );
  }
  
  export default HomeScreen
  