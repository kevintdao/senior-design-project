import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';

const HomeScreen = ( ) => {
  const navigation = useNavigation();
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("LoginScreen");
      });
  }

  return (
      <SafeAreaView style={tw`flex-1 items-center bg-blue-200`}>
        <View>
          <Text style={tw`text-black`}>Home</Text>
        </View>
        
        <View style={tw`mt-5`}> 
          <View style={tw`bg-green-600 mb-3 items-center rounded-md p-2`}> 
            <TouchableOpacity>
              <Text style={tw`text-white`}>Begin New Session</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`bg-green-600 mb-3 items-center rounded-md p-2`}>
            <TouchableOpacity>
              <Text style={tw`text-white`}>Data Viewing and Analysis</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`bg-green-600 mb-3 items-center rounded-md p-2`}>
            <TouchableOpacity>
              <Text style={tw`text-white`}>Sensor Testing</Text>
            </TouchableOpacity>
          </View>


          <View style={tw``}>
            <View style={tw`bg-green-800 items-center rounded-md p-2`}>
              <TouchableOpacity>
                <Text style={tw`text-white `}>&#x2699;</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`bg-green-800 items-center rounded-md p-2 mt-2`}>
              <TouchableOpacity>
                <Text style={tw`text-white`}>&#x3f;</Text>
              </TouchableOpacity>
            </View>

            <View style={tw``}>
              <TouchableOpacity style={tw`bg-green-800 items-center rounded-md p-2 mt-2`}>
                <Text 
                  style={tw`text-white`}
                  onPress={handleLogout}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        
      </SafeAreaView>
    );
  }
  
  export default HomeScreen
  