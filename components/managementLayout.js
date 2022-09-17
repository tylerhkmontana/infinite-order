import { useAuthContext } from "../context/authContext"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { auth } from '../modules/firebase'
import styles from './styles/managementLayout.module.scss'

export default function ManagementLayout({ children }) {
    const {user, isLoading, logout} = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if(!auth.currentUser && !isLoading) {
            router.push("/management/login")
        } 
    }, [auth.currentUser, isLoading])

    return(
        <>
            {
                isLoading ? <div>Loading...</div> :
                <main className={styles.container}>
                    <button className={styles.logout_btn} onClick={logout}>logout</button> 
                    { children }
                </main> 
            }
        </>
  
    )
}