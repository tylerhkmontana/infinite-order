import '../styles/globals.scss'
import Head from 'next/head'
import { useEffect } from 'react'
import { AuthProvider } from '../context/authContext'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, [])

  return <>
    <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/logo.png"></link>
        <link rel='icon' href='/icons/logo.png'></link>
        <meta name="theme-color" content="#fff" />
        <title>Infinite-Order</title>
    </Head>
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
  </>
}

export default MyApp
