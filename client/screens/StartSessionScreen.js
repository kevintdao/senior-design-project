import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    </SafeAreaView>

  )
}

export default StartSessionScreen