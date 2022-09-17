import { useAuthContext } from "../../context/authContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from '../../styles/Signup.module.scss'
import ManagementLayout from "../../components/managementLayout"

export default function Signup() {
    const [businessName, setBusinessName] = useState()
    const { user, signup, isLoading, logout } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if(user) {
            user.businessName && router.push('/management')
        }
    }, [user])

    function signupHandler(e) {
        e.preventDefault()
        signup(businessName)
    }

    return (
        <ManagementLayout>
            <div>
                {
                    user ? 
                    <div className={styles.container}>
                        <button className={styles.logout_btn} onClick={logout}>logout</button> 
                        <form className={styles.signup_form} onSubmit={signupHandler}>
                            <h1>Sign UP</h1>
                            <h2>What is your business name?</h2>
                            <input type='text' placeholder="Business Name" onChange={e => setBusinessName(e.target.value)}/>
                            <button type="submit">Sign Up</button>
                        </form>
                    </div> :
                    <div>Redirecting...</div> 
                }
            </div>
        </ManagementLayout>

    )
}