import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from './utils/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = React.createContext();

export function useAuth(){
  return useContext(AuthContext);
}

export function AuthProvider({ children }){
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  
  const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await setUserInFirestore(email);
    logout();
  }

  const login = async (email, password) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(data);
    AsyncStorage.setItem("auth_data", JSON.stringify(data));
  }

  const logout = async () => {
    setCurrentUser(undefined);

    const data = await signOut(auth);
    await AsyncStorage.removeItem("auth_data");
  }

  const changePassword = async (currPassword, newPassword) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currPassword);
    await reauthenticateWithCredential(user, credential);
    const data = await updatePassword(user, newPassword);
  }

  const setUserInFirestore = async (email) => {
    const docRef = await setDoc(doc(db, 'users', email.toLowerCase()), {
      active_session: false
    })
  }

  useEffect(() => {
    setLoading(true);
    loadStorageData();
    return () => {
      setLoading(false);
    }
  }, [])

  const loadStorageData = async () => {
    try{
      const authData = await AsyncStorage.getItem("auth_data");
      if(authData){
        const data = JSON.parse(authData);
        setCurrentUser(data);
      }
    }
    catch(error){

    }
    finally{
      setLoading(false);
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}