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
            const orderform = JSON.parse(window.localStorage.getItem('orderform')) || null
            setOrders({...orders})
            setOrderform(orderform)
        }
    }, [isLoading])

    function clearStorage() {
        setIsLoading(true)
        if(typeof window !== undefined) {
            window.localStorage.removeItem('orders')
            window.localStorage.removeItem('orderform')
        }
        setIsLoading(false)
    }

    async function getOrderform(e) {
        e.preventDefault()
        setIsLoading(true)
        const q = query(collection(db, "orderforms"), where("id", "==", orderformId), limit(1))
        let foundOrderform

        try {
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(doc => {
            foundOrderform = doc.data()
            })
            
            setOrderform({...foundOrderform})
            window.localStorage.setItem('orderform', JSON.stringify({
                ...foundOrderform
            }))
            setOrderformId('')
        } catch(err) {
            console.log('failed to retrieve the orderform')
            console.error(err)
        }
       
        setIsLoading(false)
    }
    
    return(
        <ServerLayout>
            <h1>Current orders</h1>
            <form className={styles.get_orderform_form} onSubmit={getOrderform}>
                <input onChange={e => setOrderformId(e.target.value)} type='text' placeholder="Order Id" value={orderformId} required/>
                <button type='submit'>get orderform</button>
                <button onClick={() => clearStorage()}>Clear Storage</button>
            </form>
            <br/>
          
            {
                isLoading ? <div>Getting orderform from the server...</div> :
                <div>
                    {
                        orderform ? 
                        <div>
                            Yes orderform
                            <button onClick={() => console.log(orderform)}>check orderform</button>
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