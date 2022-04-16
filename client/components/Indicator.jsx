import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc'

export default function Indicator ({ level }) {
    const empty = <FontAwesome name="battery-0" size={24} />
    const low = <FontAwesome name="battery-1" size={24} />
    const half = <FontAwesome name="battery-2" size={24} />
    const threequarters = <FontAwesome name="battery-3" size={24} />
    const full = <FontAwesome name="battery-4" size={24} />

    let batterylevel
    
    if (level == 0) batterylevel = empty
    else if (level > 0 && level <= 25) batterylevel = low
    else if (level > 25 && level <= 50) batterylevel = half
    else if (level > 50 & level <= 75) batterylevel = threequarters
    else if (level > 75) batterylevel = full
    
    return (
    <View style={tw`flex-row items-center`}>
        {batterylevel}
        <Text style={tw`ml-2`}>{`${level}%`}</Text>
    </View>
    )
}
