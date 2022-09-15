import { useEffect, useState } from 'react'
import ServerLayout from '../../components/serverLayout'
import styles from '../../styles/Server.module.scss'

export default function Server() {
    const [orders, setOrders] = useState({})

    useEffect(() => {   
        if(typeof window !== 'undefined') {
            const orders = JSON.parse(window.localStorage.getItem('orders')) || {}
            setOrders(() => ({...orders}))
        }
    }, [])

    function clearStorage() {
        if(typeof window !== undefined) {
            window.localStorage.removeItem('orders')
            const orders = JSON.parse(window.localStorage.getItem('orders')) || {}
            setOrders(() => ({...orders}))
        }
    }
    
    return(
        <ServerLayout>
            <h1>Current orders</h1>
            <button onClick={() => clearStorage()}>Clear Storage</button>

            <div className={styles.order_container}>
                {
                    Object.keys(orders).map((orderId, id) => 
                    <button key={orderId}>
                        { orders[orderId].name } : { orders[orderId].time }
                    </button>
                    )
                }
            </div>
        </ServerLayout>
    )   
}