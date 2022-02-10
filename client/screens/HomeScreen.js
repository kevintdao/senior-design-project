import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
const HomeScreen = ( ) => {
  const navigation = useNavigation();
  return (
      <SafeAreaView style={tw`flex-1 items-center bg-green-700`}>
        <Text style={tw`text-white`}>Home</Text>
        <View style={tw`flex-1 items-center bg-green-300`}> 
          <View style={tw`bg-green-600`}> 
            <TouchableOpacity>
              <Text style={tw`text-white`}>Begin New Session</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`bg-green-600`}>
            <TouchableOpacity>
              <Text style={tw`text-white`}>Data Viewing and Analysis</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`bg-green-600`}>
            <TouchableOpacity>
              <Text style={tw`text-white`}>Sensor Testing</Text>
            </TouchableOpacity>
          </View>


          <View style={tw`bg-red-300`}>
            <View style={tw`bg-green-600 items-center`}>
              <TouchableOpacity>
                <Text style={tw`text-white`}>&#x2699;</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`bg-green-600 items-center`}>
              <TouchableOpacity>
                <Text style={tw`text-white`}>&#x3f;</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        
      </SafeAreaView>
    );
  }
  
  export default HomeScreen
  