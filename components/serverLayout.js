import styles from './styles/serverLayout.module.scss'
import { motion } from "framer-motion";
import Head from 'next/head'
import Link from 'next/link'

export default function serverLayout({ children, title }) {
    const variants = {
        hidden: { opacity: 0 },
        enter: { opacity: 1 },
        exit: { opacity: 0 },
    }
    return (
        <>
            <Head>
                <title>Infinite-Order | Server </title>
            </Head>
            <div className={styles.container}>
                <motion.main
                    variants={variants} // Pass the variant object into Framer Motion 
                    initial="hidden" // Set the initial state to variants.hidden
                    animate="enter" // Animated state to variants.enter
                    exit="exit" // Exit state (used later) to variants.exit
                    transition={{ type: 'linear' }} // Set the transition to linear
                    className={styles.main}
                >
                    { children }
                </motion.main>
                <div className={styles.nav}>
                    <Link href="/server"><button><img alt='server home button' src="/icons/home.svg"/></button></Link>
                    <hr/>
                    <Link href="/server/orderform"><button><img alt='create new order button' src="/icons/plus.svg"/></button></Link>
                </div>
            </div>
        </>
    )
}