import React, { useContext, useEffect, useState } from 'react'
import { auth } from './utils/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}