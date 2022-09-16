import styles from '../../styles/Login.module.scss'
import { useAuthContext } from '../../context/authContext'

export default function Login() {
    const { login } = useAuthContext()
    return(
        <div className={styles.container}>
            <img onClick={login} className={styles.google_signin_btn} alt='google signin button' src='/icons/google_signin_btn.png'/>
        </div>
    )
}