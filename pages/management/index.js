import styles from '../../styles/Management.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'
import { getDocs, query, where, collection, limit, setDoc, doc } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db } from '../../modules/firebase'

export default function Management() {
    const { user, orderform } = useAuthContext()
    
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
                            orderform ? 
                            <Link href={`/management/manageOrderform`}><a href='/management/manageOrderform'>Manage Your Orderform &rarr;</a></Link> :
                            <Link href={`/management/createOrderform`}><a href='/management/createOrderform'>Create Orderform &rarr;</a></Link>
                        }
                    </div> 
                </div> :
                <div>redirecting...</div>
            }
        </ManagementLayout>
    )
}