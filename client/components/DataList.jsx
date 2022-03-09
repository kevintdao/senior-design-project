import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { DataTable } from 'react-native-paper'
import tw from 'twrnc'
import { formatTime } from '../utils/time'

export default function DataList(props) {
  const data = props.data;

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Marker</DataTable.Title>
          <DataTable.Title>Temperature</DataTable.Title>
          <DataTable.Title>Time</DataTable.Title>
        </DataTable.Header>

        {data.map((item, index) => {
          const timestamp = item.time.toDate();;
          const time = formatTime(timestamp.getHours(), timestamp.getMinutes());

          return (
            <DataTable.Row key={index}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{item.temperature}</DataTable.Cell>
              <DataTable.Cell>{`${time}`}</DataTable.Cell>
            </DataTable.Row>
          )
        })}
      </DataTable>
    </View>
  )
}