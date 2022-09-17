import { createContext, useContext, useState } from "react";
import { provider, auth, db } from "../modules/firebase"
import { signInWithRedirect, onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from "react";
import { getDocs, query, where, collection, limit, setDoc, doc } from 'firebase/firestore'
import { useRouter } from "next/router";
import { v4 as uuid4 } from 'uuid'

const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
          setUser({
            name: displayName,
            email: email,
            businessName: foundUser.businessName
          })
        } else {
          setUser({
            name: displayName,
            email: email
          })
          router.push("/management/signup")
        }
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
  }

  const signup = async (businessName) => {
      await setDoc(doc(db, "users", uuid4()), {
        name: user.name,
        email: user.email,
        businessName: businessName
      });
    
      setUser(prev => ({
        ...prev,
        businessName: businessName
      }))

      router.push('/management')
  }
  return (
    <Context.Provider value={{ user, isLoading, login, logout, signup }}>{children}</Context.Provider>
  );
}

export function useAuthContext() {
  return useContext(Context);
}