import { useAuthContext } from "../../context/authContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from '../../styles/Signup.module.scss'

export default function Signup() {
    const [businessName, setBusinessName] = useState()
    const { user, signup, isLoading } = useAuthContext()
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
        <div>
            {
                isLoading ? <div>Loading...</div> :
                <div>
                    {
                        user.businessName ? <div>Redirecting...</div> :
                        <div className={styles.container}>
                            <form className={styles.signup_form} onSubmit={signupHandler}>
                                <h1>Sign UP</h1>
                                <h2>What is your business name?</h2>
                                <input type='text' placeholder="Business Name" onChange={e => setBusinessName(e.target.value)}/>
                                <button type="submit">Sign Up</button>
                            </form>
                        </div>
                    }
                </div>
            }
        </div>
    )
}