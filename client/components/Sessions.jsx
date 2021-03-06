import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { formatTime } from '../utils/time';

export default function Sessions(props) {
  const [value, setValue] = useState(null);
  const data = props.data;
  const onSelect = props.onSelect;

  return (
    <View style={tw``}>
      <View style={tw`h-4/5`}>
        <FlatList
          data={Object.keys(data)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const start = data[item].start;
            const date = `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()}`;
            const time = formatTime(start.getHours(), start.getMinutes());

            return (
              <View style={tw`justify-between`}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={tw`bg-gray-400 border rounded p-2 my-2 ${value == item ? "border-green-600" : "border-gray-300"}`}
                  onPress={() => setValue(item)}         
                >
                  <View style={tw`flex-1 flex-row items-center justify-between`}>
                    <Text style={tw`text-lg mr-7`}>{`${date} ${time}`}</Text>
                    {value == item && <Ionicons name="md-checkmark-circle" size={18} color="green"/>}
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>

      <View style={tw`mt-3`}>
        <TouchableOpacity
          style={tw`items-center rounded p-3 mb-3 ${value ? "bg-blue-700" : "bg-gray-300"}`}
          disabled={!value}
          onPress={() => onSelect(value)}
        >
          <Text style={tw`text-white text-lg`}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}