import React from 'react';
import { Text, View, Button} from 'react-native';

const Home = ({navigation} ) => {
    return (
        <View>
          <Text>Home</Text>
          <View> {/* Button Container */}
            <Button title="Begin New Session" onPress={()=> navigation.navigate('NewSession')}/>
            <Button title="Data Viewing & Analysis" onPress={()=> navigation.navigate('Data')}/>
            <Button title="Sensor Testing" onPress={()=> navigation.navigate('Test')}/>
            <View>
              <Button title="Settings" onPress={()=> navigation.navigate('Settings')}/>
              <Button title="Help" onPress={()=> navigation.navigate('Help')}/>
            </View>
          </View>
        </View>
        );
  }
  
  export default Home
  