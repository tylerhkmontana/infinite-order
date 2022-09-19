import { useEffect, useState } from 'react'
import ServerLayout from '../../components/serverLayout'
import styles from '../../styles/Server.module.scss'
import { db } from '../../modules/firebase'
import { getDocs, query, where, collection, limit } from 'firebase/firestore'

export default function Server() {
    const [orders, setOrders] = useState({})
    const [orderform, setOrderform] = useState(null)
    const [orderformId, setOrderformId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

    async function getOrderform(e) {
        e.preventDefault()
        setIsLoading(true)
        const q = query(collection(db, "orderforms"), where("userId", "==", orderformId), limit(1))
        let foundOrderform
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => {
        foundOrderform = doc.data()
        })
        
        setOrderform({...foundOrderform})
        setIsLoading(false)
    }
    
    return(
        <ServerLayout>
            <h1>Current orders</h1>
            <form className={styles.get_orderform_form} onSubmit={getOrderform}>
                <input onChange={e => setOrderformId(e.target.value)} type='text' placeholder="Order Id" required/>
                <button type='submit'>get orderform</button>
            </form>
            <br/>
            <button onClick={() => clearStorage()}>Clear Storage</button>
            {
                isLoading ? <div>Getting orderform from the server...</div> :
                <div>
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