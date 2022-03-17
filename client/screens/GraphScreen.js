import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import MapGraph from '../components/MapGraph'
import tw from 'twrnc'
import DataList from '../components/DataList'
import LineGraph from '../components/LineGraph'
import PagerView from 'react-native-pager-view'

export default function GraphScreen(props) {
  const data = props.route.params.session_data;

  return (
    <View style={tw`flex-1 items-center`}>
      <MapGraph data={data}/>
      <PagerView initialPage={0} style={styles.pager} showPageIndicator={true} styles={styles.pager}>
        <View key="0">
          <Text style={tw`text-3xl font-bold text-gray-900 mt-1 mb-2 text-center`}>Data</Text>
          <DataList data={data}/>
        </View>
        <View key="1">
          <Text style={tw`text-3xl font-bold text-gray-900 mt-1 mb-2 text-center`}>Graph</Text>
          <LineGraph data={data}/>
        </View>
      </PagerView>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  pager: {
    width: Dimensions.get('window').width * 0.85,
    height: (Dimensions.get('window').height / 2) - 30,
    marginTop: 10
  }
})