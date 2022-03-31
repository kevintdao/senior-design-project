import React, { useState } from 'react'
import { View } from 'react-native'
import tw from 'twrnc'
import { query, collection, getDocs, orderBy } from '@firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../AuthContext'

export default function Indicator() {

    // const { currentUser } = useAuth();
    // const user = currentUser.user;
    // const email = user.email;
    
    // add refresh to update indicator regularly by pulling from db every ~10s
    // const q = query(collection(db, `users/${email}/batterylevel`));
    // const docsSnap = await getDocs(q);

    // powerLevel = docsSnap.data().level;

    const powerLevels = ['Empty', 'Low', 'Half', 'Full']
    const powerLevel = powerLevels[0]
    const empty = <FontAwesomeIcon icon="fa-solid fa-battery-empty" />
    const low = <FontAwesomeIcon icon="fa-solid fa-battery-low" />
    const quarter = <FontAwesomeIcon icon="fa-solid fa-battery-quarter" />
    const half = <FontAwesomeIcon icon="fa-solid fa-battery-half" />
    const threequarters = <FontAwesomeIcon icon="fa-solid fa-battery-three-quarters" />
    const full = <FontAwesomeIcon icon="fa-solid fa-battery-full" />
    

    if(powerLevel == 'Empty')
    {
        return <View style={tw``}>{empty}</View>
    }
    else if(powerLevel == 'Low')
    {
        return <View style={tw``}>{low}</View>
    }
    else if(powerLevel == 'Half')
    {
        return <View style={tw``}>{half}</View>
    }
    return <View style={tw``}>{full}</View>
}
