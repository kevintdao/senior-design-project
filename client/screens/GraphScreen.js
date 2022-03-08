import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import MapView from 'react-native-maps'
import { query, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebase'
import tw from 'twrnc'
import Session from '../components/Sessions'
import Loading from '../components/Loading'

export default function GraphScreen() {
  const { currentUser } = useAuth();
  const [sess, setSess] = useState();
  const [loading, setLoading] = useState(true);
  const user = currentUser.user;
  const email = user.email;

  const getSessions = async () => {
    const output = {};
    const q = query(collection(db, `users/${email}/sessions`));

    const docsSnap = await getDocs(q);

    docsSnap.forEach((doc) => {
      const start = doc.data().start.toDate();
      output[doc.id] = {
        "start": start
      }
    });
    return output;
  } 

  useEffect(() => {
    setLoading(true);
    getSessions().then(data => {
      setSess(data);
      setLoading(false);
    })
  }, [])

  // get data based on selected session
  const onSelect = (session) => {
    console.log(session)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <View>
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: 41.65944687412238,
          longitude: -91.53652901001102,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
      />

      <Text style={tw`text-3xl font-bold text-gray-900 mt-1 mb-2 text-center`}>Sessions</Text>

      <Session data={sess} onSelect={onSelect}/>
    </View>

  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
})