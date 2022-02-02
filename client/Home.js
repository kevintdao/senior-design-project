import React from 'react';
import { Text, View, Button} from 'react-native';

export default function Home() {
    return (
        <View>
          <Text>Home</Text>
          <View> {/* Button Container */}
            <Button title="Begin New Session"/>
            <Button title="Data Viewing & Analysis"/>
            <Button title="Sensor Testing"/>
            <View>
              <Button title="Settings"/>
              <Button title="Help"/>
            </View>
          </View>
        </View>
        );
  }
  
  
  