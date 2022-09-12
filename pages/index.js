import styles from '../styles/Home.module.scss'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Infinite-Order</h1>
      <Link href='/orderform'><a href='/orderform'>Go To Orderform</a></Link>
    </div> 
  )
}
