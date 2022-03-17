import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../AuthContext'
import tw from 'twrnc'
import { formatTime } from '../utils/time';

export default function LastMeasurement({ data }) {
  const id = Object.keys(data)[0];
  const start = data[id].start;
  const end = data[id].end;
  const date = `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()}`;
  const time = formatTime(start.getHours(), start.getMinutes());
  const duration = getDuration(start, end)

  function getDuration (start, end) {
    const durationMillis = end - start;
    const min = Math.floor(durationMillis / 60000);
    const sec = ((durationMillis % 60000) / 1000).toFixed(0);
    return `${min}:${(sec < 10 ? '0' : '')}${sec} minute(s)`;
  }

  return (
    <View>
      <View>
        <Text style={tw`text-xl text-gray-900 mb-3`}>
          <Text style={tw`font-bold`}>Start: </Text>
          <Text>{`${date} ${time}`}</Text>
        </Text>
        <Text style={tw`text-xl text-gray-900 mb-3`}>
          <Text style={tw`font-bold`}>Duration: </Text>
          <Text>{duration}</Text>
        </Text>
      </View>
    </View>
  )
}