import styles from '../../styles/ManageOrderform.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function ManageOrderform() {
    const { user, orderform, isLoading } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
       
    }, [])

    return(
        <ManagementLayout>
            {
                user ?  
                <div className={styles.container}>
                    <div className={styles.dashboard}>
                        <h1>Management</h1>
                        <h2>Welcome { user.name }</h2>
                        <h2>Business Name: { user.businessName }</h2>
                        <Link href='/management'><a href='/management'>back to dashboard &rarr;</a></Link>
                    </div> 
                </div> :
                <div>redirecting...</div>
            }
        </ManagementLayout>
    )
}