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
  const [orderform, setOrderform] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      // Check if user logged in with google account
      if (currUser) {
        const { displayName, email } = currUser
        const foundUser = await findUser(email)

        // Check if the user signed up on the platform
        if(foundUser) {
          // Update context with the stored user information
          setUser({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            businessName: foundUser.businessName
          })
        } else {
          setUser({
            name: displayName,
            email: email
          })
          // Send the user to sign up page
          router.push("/management/signup")
        }
      } else {
        // User not logged in
        setUser(null)
      }

      // Authentication process is done
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
    let id = uuid4()
    await setDoc(doc(db, "users", id), {
      id: id,
      name: user.name,
      email: user.email,
      businessName
    });
    
    setUser(prev => ({
      ...prev,
      id,
      businessName
    }))

    router.push('/management')
  }

  const findUser = async (email) => {
    const q = query(collection(db, "users"), where("email", "==", email), limit(1))
    let foundUser
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      foundUser = doc.data()
    })

    return foundUser
  }


  return (
    <Context.Provider value={{ user, isLoading, login, logout, signup }}>{children}</Context.Provider>
  );
}

export function useAuthContext() {
  return useContext(Context);
}