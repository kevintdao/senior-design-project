import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc'

export default function NewSessionScreen(props) {
  const start = props.route.params.start;
  const end = props.route.params.end;

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>Start Lat: {start.latitude}</Text>
      <Text>Start Long: {start.longitude}</Text>
      <Text>End Lat: {end.latitude}</Text>
      <Text>End Long: {end.longitude}</Text>
    </View>
  )
}