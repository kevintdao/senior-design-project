import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
const HomeScreen = ( ) => {
  const navigation = useNavigation();
  return (
      <SafeAreaView style={tw`flex-1 items-center bg-green-700`}>
        <Text>Home</Text>
        <View style={tw`flex-1 items-center`}> 
          <TouchableOpacity>
            <Text>Begin New Session</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Data Viewing and Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Sensor Testing</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity>
              <Text>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </SafeAreaView>
    );
  }
  
  export default HomeScreen
  