import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Svg, G, Line } from 'react-native-svg'

const GRAPH_MARGIN = 20;
const colors = {
  axis: "#000000"
}

export default function LineGraph() {
  const SVGHeight = Dimensions.get('window').height / 2.5;
  const SVGWidth = Dimensions.get('window').width * 0.85 - 15;
  const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
  const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;

  // X scale point

  // Y scale point

  return (
    <View style={tw`px-2`}>
      <Svg width={SVGWidth} height={SVGHeight} style={tw`bg-red-100`}>
        <G y={graphHeight}>
          {/* bottom axis */}
          <Line 
            x1="0"
            y1="2"
            x2={graphWidth}
            y2="2"
            stroke={colors.axis}
            strokeWidth="0.5"
          />
        </G>
      </Svg>
    </View>
  )
}