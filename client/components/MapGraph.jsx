import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import tw from 'twrnc'

export default function MapGraph(props) {
  const data = props.data;
  const [markerList, setMarkerList] = useState([]);
  const mapRef = useRef();
  const markers = [];

  useEffect(() => {
    data.map(item => {
      markers.push({
        latitude: item.lat,
        longitude: item.long
      })
    })
  }, [])

  return (
    <View>
      <MapView 
        provider="google"
        style={styles.map} 
        ref={mapRef}
        initialRegion={{
          latitude: 41.65944687412238,
          longitude: -91.53652901001102,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
      >
        {data.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.lat,
              longitude: marker.long,
            }}
          >
            <View style={tw`p-1 rounded-md bg-red-600`}>
              <Text style={tw`font-bold text-white`}>{index+1}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
})