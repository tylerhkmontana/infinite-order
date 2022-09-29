import { createContext, useContext, useState } from "react";
import { provider, auth, db } from "../modules/firebase"
import { signInWithRedirect, onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from "react";
import { getDocs, query, where, collection, limit, setDoc, doc } from 'firebase/firestore'
import { useRouter } from "next/router";
import { v4 as uuid4 } from 'uuid'
import jwt_decode from 'jwt-decode'

const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      // Check if user logged in with google account
      if (currUser) {
        const { displayName, email, uid } = currUser
        setUser({
          uid,
          name: displayName,
          email: email
        })
      
      } else {
        // User not logged in
        setUser(null)
      }

      // Authentication process is done
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const isAuthenticated = async () => {
    const currUser = auth.currentUser
    if (currUser) {
      try {
        const idToken = await currUser.getIdToken(true)
        const { exp } = jwt_decode(idToken)
        const currTime = Math.floor(Date.now()/1000)
        return exp > currTime
      } catch (err) {
        console.log("failed to authenticate")
        console.error(err)
        return false
      }
    } else {
      return false
    }
  }

  const login = () => {
    signInWithRedirect(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <Context.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>{children}</Context.Provider>
  );
}

export function useAuthContext() {
  return useContext(Context);
}