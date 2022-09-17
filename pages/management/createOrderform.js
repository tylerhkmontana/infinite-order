import styles from '../../styles/CreateOrderform.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'
import { db } from '../../modules/firebase'
import { getDocs, query, where, collection, limit, setDoc, doc } from 'firebase/firestore'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function CreateOrderform() {
    const { user, orderform, isLoading } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if(!isLoading && orderform) {
            orderform && router.push('/management/manageOrderform')
        }
    }, [isLoading])

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