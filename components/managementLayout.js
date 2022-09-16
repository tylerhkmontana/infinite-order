import { useAuthContext } from "../context/authContext"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { auth } from '../modules/firebase'
import styles from './styles/managementLayout.module.scss'

export default function ManagementLayout({ children }) {
    const {user, isLoading, logout} = useAuthContext()
    const router = useRouter()


    return(
        <>
            {
                isLoading ? <div>...Loading</div> :
                <div className={styles.container}>{ children }</div> 
            }
        </>
  
    )
}