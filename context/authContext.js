import { createContext, useContext, useState } from "react";
import { provider, auth } from "../modules/firebase"
import { signInWithRedirect, onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from "react";

const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          email: user.email
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