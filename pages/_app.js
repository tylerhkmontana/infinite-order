import '../styles/globals.scss'
import Head from 'next/head'
import { AuthProvider } from '../context/authContext'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/logo.png"></link>
        <meta name="theme-color" content="#fff" />
    </Head>
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
  </>
}

export default MyApp
