import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import MapView, { Callout, Marker } from 'react-native-maps'

export default function NewSessionScreen(props) {
  const markers = props.route.params.markers;

  return (
    <View style={tw`flex-1 items-center bg-gray-100`}>
      <MapView 
        provider="google"
        style={styles.map} 
        initialRegion={{
          latitude: 41.65944687412238,
          longitude: -91.53652901001102,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
      ></MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.5,
  }
})