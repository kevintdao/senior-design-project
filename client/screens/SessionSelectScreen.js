import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { query, collection, getDocs, orderBy } from '@firebase/firestore'
import { db } from '../utils/firebase'
import tw from 'twrnc'
import Sessions from '../components/Sessions'
import Loading from '../components/Loading'

export default function SessionSelectScreen() {
  const navigation = useNavigation();
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

  const onSelect = async (session) => {
    const output = [];
    const q = query(collection(db, `users/${email}/sessions/${session}/data`), orderBy("time"));

    const docsSnap = await getDocs(q);
    docsSnap.forEach((doc) => {
      output.push(doc.data());
    });

    navigation.navigate('GraphScreen', { session_data: output });
  }

  useEffect(() => {
    setLoading(true);
    getSessions().then(data => {
      setSess(data);
      setLoading(false);
    })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100 mt-2`}>
      <View style={tw.style(`w-4/5 max-w-md`, styles.container)}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>Sessions</Text>

        <Sessions data={sess} onSelect={onSelect}/>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 25,
  }
})