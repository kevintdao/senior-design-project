import { View, Text } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames';

export default function Alert(props) {
  const type = props.type;
  const text = props.text;

  const style = {
    success: {
      view: "bg-green-100 border border-green-400",
      text: "text-green-700"
    },
    warning: {
      view: "bg-yellow-100 border border-yellow-400",
      text: "text-yellow-700"
    },
    error: {
      view: "bg-red-100 border border-red-400",
      text: "text-red-700"
    }
  }

  return (
    <View style={tw`${style[type].view} px-4 py-3 rounded mb-2`}>
      <Text style={tw`${style[type].text} font-bold`}>{text}</Text>
    </View>
  )
}