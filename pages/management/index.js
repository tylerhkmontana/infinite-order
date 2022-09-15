import styles from '../../styles/Management.module.scss'
import { useAuthContext } from '../../context/authContext'

export default function Management() {
    const { user, isLoading, login, logout } = useAuthContext()
    return(
        <div>
            {
                isLoading ? <p>Loading...</p> :
                
                <div className={styles.container}>
                {
                    user ?  
                    <div className={styles.dashboard}>
                        <button className={styles.logout_btn} onClick={logout}>logout</button> 
                        <h1>Management</h1>
                        <h2>Welcome { user.name }</h2>
                    </div> : 
                    <div className={styles.pleaseLogin}>
                        <img onClick={login} className={styles.google_signin_btn} alt='google signin button' src='/icons/google_signin_btn.png'/>
                    </div>
                }
                </div> 
            }
        </div>
    )
}