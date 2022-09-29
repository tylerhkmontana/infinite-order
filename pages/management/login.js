import styles from '../../styles/Login.module.scss'
import { useAuthContext } from '../../context/authContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
    const { login, isLoading, user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if(!isLoading && user) {
            router.push('/management')
        } 
    }, [user, isLoading])

    return(
        <div>
            {
                isLoading ? <div>Loading...</div> : 
                <div>
                    {
                        user ? <div>Redirecting...</div> : 
                        <div className={styles.container}>
                            <div className={styles.main}>
                                <h1>Welcome to infinite order</h1>
                                <img onClick={login} className={styles.google_signin_btn} alt='google signin button' src='/icons/google_signin_btn.png'/>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}