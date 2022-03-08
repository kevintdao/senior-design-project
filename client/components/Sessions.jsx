import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

export default function Sessions(props) {
  const [value, setValue] = useState(null);
  const data = props.data;

  return (
    <View style={tw`items-center h-1/2`}>
      <View style={tw`w-4/5 max-w-md h-6/12 border border-gray-300 rounded-md`}>
        <FlatList
          data={Object.keys(data)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const start = data[item].start;
            const date = `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()}`;
            const time = `${start.getHours()}:${start.getMinutes()}`;

            return (
              <View style={tw`justify-between`}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={tw`bg-gray-400 border rounded p-2 m-2 ${value == data[item] ? "border-green-600" : "border-gray-300"}`}
                  onPress={() => setValue(data[item])}         
                >
                  <View style={tw`flex-1 flex-row items-center justify-between`}>
                    <Text style={tw`text-lg mr-7`}>{`${date} ${time}`}</Text>
                    {value == data[item] && <Ionicons name="md-checkmark-circle" size={18} color="green"/>}
                  </View>
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