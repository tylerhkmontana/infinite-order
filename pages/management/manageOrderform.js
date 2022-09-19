import styles from '../../styles/ManageOrderform.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '../../modules/firebase'
import { getDocs, query, where, collection, limit } from 'firebase/firestore'

export default function ManageOrderform() {
    const { user } = useAuthContext()
    const [orderform, setOrderform] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getOrderform = async () => {
                if(user) {
                const q = query(collection(db, "orderforms"), where("userId", "==", user.id), limit(1))
                let foundOrderform
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach(doc => {
                foundOrderform = doc.data()
                })
                
                setOrderform({...foundOrderform})
                setIsLoading(false)
            }
        }

        getOrderform()
    }, [user])

    return(
        <ManagementLayout>
            {
                user ?  
                <div className={styles.container}>
                    <div className={styles.dashboard}>
                        <h1>Management</h1>
                        <h2>Welcome { user.name }</h2>
                        <h2>Business Name: { user.businessName }</h2>
                        {
                            isLoading ? 
                            <div>
                                Loading...
                            </div> :
                            <div className={styles.orderform_container}>
                                {
                                    orderform ? 
                                    <div>
                                        Yes orderform
                                    </div> :
                                    <div>
                                        No orderform
                                    </div>
                                }
                            </div>
                        }
                        <Link href='/management'><a href='/management'>back to dashboard &rarr;</a></Link>
                    </div> 
                </div> :
                <div>redirecting...</div>
            }
        </ManagementLayout>
    )
}