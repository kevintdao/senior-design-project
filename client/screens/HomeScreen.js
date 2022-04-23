import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { query, collection, getDocs, orderBy, limit } from '@firebase/firestore'
import { db } from '../utils/firebase'
import tw from 'twrnc';
import { useAuth } from '../AuthContext';
import LastMeasurement from '../components/LastMeasurement';
import Loading from '../components/Loading';
import { ref, onValue, update } from 'firebase/database'
import { rtdb } from '../utils/firebase'

export default function HomeScreen ({ navigation }) {
  const { currentUser } = useAuth();
  const [sess, setSess] = useState();
  const [loading, setLoading] = useState(true);
  const user = currentUser.user;
  const email = user.email;
  const [boat, setBoat] = useState()
  const rtRef = ref(rtdb)
  
  const getLastSession = async () => {
    const output = {};
    const q = query(collection(db, `users/${email}/sessions`), orderBy('start', 'desc'), limit(1));

    const docsSnap = await getDocs(q);
    docsSnap.forEach((doc) => {
      const start = doc.data().start.toDate();
      const end = doc.data().end.toDate();
      output[doc.id] = {
        "start": start,
        "end": end,
      }
    });
    return output;
  }

  useEffect(() => {
    setLoading(true);
    const unsubscibe = navigation.addListener('focus', () => {
      getLastSession().then(data => {
        setSess(data);
        setLoading(false);
      })
    });

    return unsubscibe;
  }, [navigation])

  useEffect(() => {
    return onValue(rtRef, snapshot => {
      setBoat(snapshot.val())
    })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100 mt-2`}>
      <ScrollView contentContainerStyle={tw`items-center`}>
      <View style={tw.style(`w-4/5 max-w-md`)}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-5`}>Home</Text>
        <Text style={tw`text-xl text-gray-900 mb-5`}>
          <Text style={tw`font-bold`}>Logged in as: </Text>
          <Text>{email}</Text>
        </Text>
      
        <View style={tw`mb-2`}>
          <Text style={tw`text-3xl font-bold text-gray-900 mt-5 mb-5`}>Last Measurement</Text>
          <LastMeasurement data={sess} />
        </View>



        <View style={tw`mt-5`}> 
          <View>
            {boat.in_session == true ?
              <TouchableOpacity 
                style={tw`bg-green-600 mb-3 items-center rounded p-3`}
                onPress={() => navigation.navigate("NewSessionScreen", { 
                  markers: boat.markers
                })}
              >
                <Text style={tw`text-white text-lg`}>View Current Session</Text>
              </TouchableOpacity> :
              <TouchableOpacity 
                style={tw`bg-green-600 mb-3 items-center rounded p-3`}
                onPress={() => navigation.navigate('StartSessionScreen')}
              >
                <Text style={tw`text-white text-lg`}>Begin New Session</Text>
              </TouchableOpacity>
            }
          </View>
          <View>
            <TouchableOpacity style={tw`bg-green-600 mb-3 items-center rounded p-3`}>
              <Text style={tw`text-white text-lg`}>Sensor Testing</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={tw`bg-green-800 items-center rounded p-3 mb-3`}>
              <Text style={tw`text-white text-lg`}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
