import { useAuthContext } from "../context/authContext"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { auth } from '../modules/firebase'
import styles from './styles/managementLayout.module.scss'
import Head from 'next/head'

export default function ManagementLayout({ children }) {
    const {user, isLoading } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if(!auth.currentUser && !isLoading) {
            router.push("/management/login")
        } 
    }, [auth.currentUser, isLoading])

    return(
        <>
            <Head>
                <title>Infinite-Order | Management</title>
            </Head>
            {
                isLoading ? <div>Loading...</div> :
                <main className={styles.container}>
                    { children }
                </main> 
            }
        </>
  
    )
}