import { useEffect, useState } from 'react'
import ServerLayout from '../../components/serverLayout'

export default function Server() {
    const [orders, setOrders] = useState({})

    useEffect(() => {   
        if(typeof window !== 'undefined') {
            const orders = JSON.parse(window.localStorage.getItem('orders')) || {}
            setOrders(() => ({...orders}))
        }
    }, [])
    
    return(
        <ServerLayout>
            <h1>Current orders</h1>
            <button onClick={() => console.log(orders)}>Check Orders</button>
        </ServerLayout>
    )   
}