import styles from '../../styles/Login.module.scss'
import { useAuthContext } from '../../context/authContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

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
                                <h1>Infinite Order</h1>
                                <Image src='/icons/logo.png' width={150} height={150}/>
                                <div className={styles.signin_container}>
                                    <img onClick={login} className={styles.google_signin_btn} alt='google signin button' src='/icons/google_signin_btn.png'/>
                                    <p>&#8212; or &#8212;</p>
                                    <Link href='/'><a>Go Back Home</a></Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}