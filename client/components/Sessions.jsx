import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'

export default function Sessions(props) {
  const [value, setValue] = useState(null);
  const data = props.data;

  return (
    <View style={tw`items-center h-1/2`}>
      <View style={tw`w-4/5 max-w-md h-6/12 border border-gray-300 rounded-md`}>
        <FlatList
          data={Object.keys(data)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(session) => {
            return (
              <View style={tw``}>
                <TouchableOpacity
                  style={tw`bg-green-800 items-center rounded p-3 m-2`}
                  onPress={() => setValue(session.item)}         
                >
                  <Text style={tw`text-white text-lg`}>{session.item}</Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>

      <View style={tw`w-4/5 max-w-md mt-3`}>
        <TouchableOpacity
          style={tw`bg-blue-700 items-center rounded p-3 mb-3`}
        >
          <Text style={tw`text-white font-bold text-lg`}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}