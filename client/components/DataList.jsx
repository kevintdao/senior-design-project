import { View, Text, FlatList } from 'react-native'
import React from 'react'

export default function DataList(props) {
  const data = props.data;

  console.log(data);

  return (
    <View>
      <FlatList
        data={Object.keys(data)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item} {data[item].temperature}</Text>
            </View>
          )
        }}      
      />
    </View>
  )
}