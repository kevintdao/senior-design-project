import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import { LineChart } from 'react-native-chart-kit'

export default function LineGraph({ data }) {
  const getData = (data) => {
    const labels = [];
    const datasets = [];

    data.map((item, index) => {
      labels.push(index + 1);
      datasets.push(item.temperature);
    })

    return {
      labels: labels,
      datasets: datasets
    }
  }

  const graphData = getData(data);
  const chartConfig = {
    backgroundColor: "#f3f4f6",
    backgroundGradientFrom: "#f3f4f6",
    backgroundGradientTo: "#f3f4f6",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 10
    },
    propsForDots: {
      r: "3",
      strokeWidth: "2",
      stroke: "#000000"
    }
  }
  
  return (
    <View style={tw`px-2`}>
      <LineChart
        data={{
          labels: graphData.labels,
          datasets: [
            {
              data: graphData.datasets
            }
          ]
        }}
        width={Dimensions.get('window').width * 0.85 - 15}
        height={(Dimensions.get('window').height / 2.5)}
        yAxisLabel=""
        yAxisSuffix=' C'
        chartConfig={chartConfig}
        bezier

      />
    </View>
  )
}