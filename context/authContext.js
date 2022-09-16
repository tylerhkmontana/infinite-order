import { createContext, useContext, useState } from "react";
import { provider, auth, db } from "../modules/firebase"
import { signInWithRedirect, onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from "react";
import { getDocs, query, where, collection, limit, setDoc, doc } from 'firebase/firestore'

const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { displayName, email } = user
        const q = query(collection(db, "users"), where("email", "==", email), limit(1))
        let foundUser
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => {
          foundUser = doc.data()
        })
        
        if(foundUser) {
          console.log(foundUser)
        } else {
          await setDoc(doc(db, "users", '1'), {
            name: displayName,
            email: email
          })
        }
      
        setUser({
          name: displayName,
          email: email
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = () => {
    signInWithRedirect(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }
  return (
    <Context.Provider value={{ user, isLoading, login, logout }}>{children}</Context.Provider>
  );
}

export function useAuthContext() {
  return useContext(Context);
}