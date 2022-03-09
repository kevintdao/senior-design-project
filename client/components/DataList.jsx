import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { DataTable } from 'react-native-paper'
import tw from 'twrnc'

export default function DataList(props) {
  const data = props.data;

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Marker Number</DataTable.Title>
          <DataTable.Title>Temperature</DataTable.Title>
        </DataTable.Header>

        {data.map((item, index) => {
          return (
            <DataTable.Row key={index}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{item.temperature}</DataTable.Cell>
            </DataTable.Row>
          )
        })}
      </DataTable>
    </View>
  )
}