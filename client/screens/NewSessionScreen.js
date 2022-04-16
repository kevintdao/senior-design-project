import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from 'twrnc'
import MapView, { Callout, Marker } from 'react-native-maps'
import { ref, onValue, update } from 'firebase/database'
import { rtdb } from '../utils/firebase'
import Loading from '../components/Loading'
import Indicator from '../components/Indicator'

export default function NewSessionScreen(props) {
  const markers = props.route.params.markers;
  const [boat, setBoat] = useState()
  const rtRef = ref(rtdb)

  useEffect(() => {
    return onValue(rtRef, snapshot => {
      setBoat(snapshot.val())
    })
  }, [])

  const toggleEmergency = () => {
    update(rtRef, {
      emergency_stop: !boat.emergency_stop
    })
  }

  if (!boat) return <Loading />

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
      >
        <Marker
          pinColor='blue'
          coordinate={{ latitude: boat.latitude, longitude: boat.longitude }}
          key='boat'
        />

        {markers.map((item, index) => (
          <Marker
            pinColor='red'
            coordinate={item}
            key={index}
          >
          </Marker>
        ))}
      </MapView>

      <View style={tw`w-4/5 max-w-md`}> 
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-lg font-bold`}>Current Reading</Text>
          <Indicator level={boat.battery} />
        </View>
        <Text style={tw`text-lg`}>{`Temperature: ${boat.temperature}°C`}</Text>
      </View>

      <View style={tw`w-4/5 max-w-md`}> 
        <TouchableOpacity 
          style={tw`my-3 items-center rounded p-3 ${boat.emergency_stop ? 'bg-red-600' : 'bg-green-600'}`}
          onPress={toggleEmergency}
        >
          <Text style={tw`text-white text-lg`}>{boat.emergency_stop ? 'Emergency Stop' : 'Resume'}</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`w-4/5 max-w-md`}> 
        <TouchableOpacity 
          style={tw`bg-blue-600 mb-3 items-center rounded p-3`}
        >
          <Text style={tw`text-white text-lg`}>Return to Start</Text>
        </TouchableOpacity>
      </View>
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
    height: Dimensions.get('window').height / 2,
  }
})