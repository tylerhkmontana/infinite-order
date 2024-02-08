import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Welcome to Infinite-Order</h1>
          <Image src='/icons/logo.png' width={150} height={150}/>
          <p>
            <strong>&infin;</strong> I created this application to help waiters/waitresses work more efficienlty and professionaly, and save tons of 
            paper from being wasted as orderpads to prevent pollution. <br/><br/>
            <strong>&infin;</strong> You can create an orderform for your business through &apos;management&apos; page, and use that orderform as a server through &apos;server&apos; page.
          </p>
          <div className={styles.login_option}>
            <Link href='/management'><a className={styles.management_btn} href='/orderform'>Management</a></Link><br/>
            <Link href='/server'><a className={styles.server_btn} href='/checkOrders'>Server</a></Link>
          </div>
        </main>
      </div> 
    </>
  )
}
