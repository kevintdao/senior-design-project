import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../AuthContext'
import Loading from '../components/Loading'
import MapGraph from '../components/MapGraph'

export default function GraphScreen() {
  const { currentUser } = useAuth();
  const user = currentUser.user;
  const email = user.email;
  const mapRef = useRef();

  // get data based on selected session
    // add the markers
    // output.map((data, index) => {
    //   array.push(
    //     <Marker 
    //       key={index}
    //       coordinate={{
    //         latitude: data.lat,
    //         longitude: data.long,
    //       }}
    //     >
    //       <View style={tw`p-1 rounded-md bg-red-600`}>
    //         <Text style={tw`font-bold text-white`}>{data.temperature}</Text>
    //       </View>
    //     </Marker>
    //   )
    // })

  if (loading) {
    return <Loading />
  }

  return (
    <View>
      {/* <MapView
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
      {markerList}
      </MapView> */}

      <MapGraph markers={markerList} />

    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
})