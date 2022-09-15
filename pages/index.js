import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import { useEffect } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../modules/firebaseConfig'

export default function Home() {
  useEffect(() => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }, [])
  return (
    <div className={styles.container}>
      <h1>Welcome to Infinite-Order</h1>
      <Link href='/management'><a href='/orderform'>Management</a></Link><br/>
      <Link href='/server'><a href='/checkOrders'>Server</a></Link>
    </div> 
  )
}
