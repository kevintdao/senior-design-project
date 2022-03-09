import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapGraph from '../components/MapGraph'
import tw from 'twrnc'
import DataList from '../components/DataList'

export default function GraphScreen(props) {
  const data = props.route.params.session_data;

  return (
    <View>
      <MapGraph data={data}/>
      <Text style={tw`text-3xl font-bold text-gray-900 mt-1 mb-2 text-center`}>Graph</Text>
      <DataList data={data}/>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
})