import React from 'react';
import { Text, View, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ( ) => {
  const navigation = useNavigation();
    return (
        <View>
          <Text>Home</Text>
          <View> {/* Button Container */}
            <TouchableOpacity title="Begin New Session" onPress={()=> navigation.navigate('NewSession')}/>
            <TouchableOpacity title="Data Viewing & Analysis" onPress={()=> navigation.navigate('Data')}/>
            <TouchableOpacity title="Sensor Testing" onPress={()=> navigation.navigate('Test')}/>
            <View>
              <TouchableOpacity title="Settings" onPress={()=> navigation.navigate('Settings')}/>
              <TouchableOpacity title="Help" onPress={()=> navigation.navigate('Help')}/>
            </View>
          </View>
        </View>
        );
  }
  
  export default HomeScreen
  