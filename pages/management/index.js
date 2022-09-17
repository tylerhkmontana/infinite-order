import styles from '../../styles/Management.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'

export default function Management() {
    const { user, logout } = useAuthContext()
    
    return(
        <ManagementLayout>
            {
                user ?  
                <div className={styles.container}>
                    <div className={styles.dashboard}>
                        <button className={styles.logout_btn} onClick={logout}>logout</button> 
                        <h1>Management</h1>
                        <h2>Welcome { user.name }</h2>
                        <h2>Business Name: { user.businessName }</h2>
                    </div> 
                </div> :
                <div>redirecting...</div>
            }
        </ManagementLayout>
    )
}