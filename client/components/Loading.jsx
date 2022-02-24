import { View, ActivityIndicator } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames';

export default function Loading() {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <ActivityIndicator color="#000000"/>
    </View>
  )
}