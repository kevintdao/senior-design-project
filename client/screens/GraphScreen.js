import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { useAuth } from '../AuthContext'
import MapView from 'react-native-maps'

export default function GraphScreen() {
  const { currentUser } = useAuth();

  return (
    <View>
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: 41.65944687412238,
          longitude: -91.53652901001102,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
      />
      <Text>GraphScreen</Text>
    </View>

  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
})