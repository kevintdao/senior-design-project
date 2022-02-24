import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
const StartSessionScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`flex-1 items-center bg-blue-200`}>
        <View>
          <Text style={tw`text-black`}>Session</Text>
        </View>
        <View style={tw`bg-green-600 mt-3 items-center rounded-md p-2`}> 
          <TouchableOpacity>
            <Text style={tw`text-white`}>Begin New Session</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
            <Text>Home</Text>
          </TouchableOpacity>
        </View>
        <View>
          <MapView style={styles.map} />
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