import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import {app} from '../utils/firebase';
import firestore from '@react-native-firebase/firestore';

const StartSessionScreen = () => {
  const navigation = useNavigation();
  const markerList = [];
  const handleSubmit = () => {
    // submit markers in list
    firestore().collection('Markers').add(markerList);
  }
  function handlePress(e) {
    markerList.push(e.nativeEvent.coordinate);
    return <Marker coordinate= {e.nativeEvent.coordinate}/>;
  }

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-blue-200`}>
        <View>
          <Text style={tw`text-black`}>Session</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
            <Text>Home</Text>
          </TouchableOpacity>
        </View>
        <View>
          <MapView style={styles.map} onDoublePress = {handlePress} />
        </View>
        <View style={tw`bg-green-600 mt-3 items-center rounded-md p-2`}> 
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={tw`text-white`}>Begin New Session</Text>
          </TouchableOpacity>
        </View>

    </SafeAreaView>

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
    height: Dimensions.get('window').height,
  },
});


export default StartSessionScreen