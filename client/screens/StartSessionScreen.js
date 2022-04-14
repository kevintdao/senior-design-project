import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import MapView, { Callout, Marker } from 'react-native-maps'

export default function StartSessionScreen ({ navigation }) {
  const [value, setValue] = useState();
  const [markers, setMarkers] = useState([])

  const placeMarker = (type) => {
    setValue(type);
  }

  const mapOnPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    if(value == 'end'){
      setMarkers([...markers, coordinate])
    }

    setValue("");
  }

  console.log(markers)

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

        {markers.map((item, index) => (
          <Marker
            pinColor='red'
            coordinate={item}
            key={index}
          >
          </Marker>
        ))}
      </MapView>
      <View style={tw`mt-2`}>
        <Text style={tw`text-3xl font-bold`}>New Session</Text>
      </View>

      <View style={tw`w-4/5 max-w-md`}> 
        <TouchableOpacity 
          style={tw`mt-3 items-center border border-green-600 rounded-md p-3 ${value == 'end' ? "bg-gray-300" : "bg-green-600"}`}
          onPress={() => placeMarker('end')}
        >
          <Text style={tw`text-white text-lg`}>Place End Marker</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`mt-3 items-center rounded-md p-3 ${markers.length > 0 ? "bg-blue-700" : "bg-gray-300"}`}
          disabled={markers.length == 0}
          onPress={() => navigation.navigate("NewSessionScreen", { 
            markers: markers
          })}
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
  bubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  }
});
