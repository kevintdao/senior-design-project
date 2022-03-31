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
        return empty
    }
    else if(powerLevel == 'Low')
    {
        return low
    }
    else if(powerLevel == 'Half')
    {
        return half
    }
    return full
}
