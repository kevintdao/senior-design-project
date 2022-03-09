import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import tw from 'twrnc'

export default function MapGraph(props) {
  const markers = props.markers;
  const [markerList, setMarkerList] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    console.log(markers);
    if(mapRef.current){
      // mapRef.current.fitToSuppliedMarkers(markers);
    }
  }, [markers])

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
        {/* {markers.map((data, index) => {
          <Marker
            key={index}
            coordinate={{
              latitude: data.lat,
              longitude: data.long,
            }}
          >
            <View style={tw`p-1 rounded-md bg-red-600`}>
              <Text style={tw`font-bold text-white`}>{data.temperature}</Text>
            </View>
          </Marker>
        })} */}
        {markers.map((data, index) => {
          <Text>{data.temperature}</Text>
        })}
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