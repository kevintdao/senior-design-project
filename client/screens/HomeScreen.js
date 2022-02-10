import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ( ) => {
  const navigation = useNavigation();
  return (
      <SafeAreaView>
        <Text>Home</Text>
        <View> 
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
  