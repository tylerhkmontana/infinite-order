import { useAuthContext } from "../context/authContext"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { auth } from '../modules/firebase'
import styles from './styles/managementLayout.module.scss'

export default function ManagementLayout({ children }) {
    const {user, isLoading, logout} = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if(user) {
            console.log("Yes user")
        } else {
            router.push("/management/login")
        }
    }, [user])

    return(
        <>
            {
                isLoading ? <div>Loading...</div> :
                <main className={styles.container}>{ children }</main> 
            }
        </>
  
    )
}