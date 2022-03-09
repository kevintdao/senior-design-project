import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'

const StartSessionScreen = () => {
  const navigation = useNavigation();

  const [value, setValue] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const placeMarker = (type) => {
    setValue(type);
  }

  const mapOnPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    if(value == 'start'){
      setStart(coordinate);
    }

    else if(value == 'end'){
      setEnd(coordinate);
    }

    setValue("");
  }

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
        onPress={(e) => mapOnPress(e)}
      >
        {/* start marker */}
        {start && <Marker
          key='start'
          pinColor='blue'
          coordinate={start}
        >
        </Marker>}

        {/* end marker */}
        {end && <Marker
          key='end'
          pinColor='red'
          coordinate={end}
        >
        </Marker>}
      </MapView>
      <View>
        <Text style={tw`text-3xl font-bold`}>New Session</Text>
      </View>

      <View style={tw`w-4/5 max-w-md`}> 
        <TouchableOpacity 
          style={tw`mt-3 items-center border border-green-600 rounded-md p-3 ${value == 'start' ? "bg-gray-300" : "bg-green-600"}`}
          onPress={() => placeMarker('start')}
        >
          <Text style={tw`text-white text-lg`}>Place Start Marker</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`mt-3 items-center border border-green-600 rounded-md p-3 ${value == 'end' ? "bg-gray-300" : "bg-green-600"}`}
          onPress={() => placeMarker('end')}
        >
          <Text style={tw`text-white text-lg`}>Place End Marker</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`mt-3 items-center rounded-md p-3 ${start && end ? "bg-blue-700" : "bg-gray-300"}`}
          disabled={!start && !end}
        >
          <Text style={tw`text-white text-lg font-bold`}>Begin New Session</Text>
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
  },
});


export default StartSessionScreen