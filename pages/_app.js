import '../styles/globals.scss'
import Head from 'next/head'
import { AuthProvider } from '../context/authContext'

function MyApp({ Component, pageProps }) {
  return <>
  <AuthProvider>
   <Component {...pageProps} />
  </AuthProvider>
  </>
}

export default MyApp
