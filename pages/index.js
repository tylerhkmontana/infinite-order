import styles from '../styles/Home.module.scss'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <h1>Welcome to Infinite-Order</h1>
        <div className={styles.login_option}>
          <Link href='/management'><a className={styles.management_btn} href='/orderform'>Management</a></Link><br/>
          <Link href='/server'><a className={styles.server_btn} href='/checkOrders'>Server</a></Link>
        </div>
      </div> 
    </>
  )
}
