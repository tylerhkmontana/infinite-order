import { useEffect, useState } from 'react'
import ServerLayout from '../../components/serverLayout'
import Modal from '../../components/modal'
import Link from 'next/link'
import styles from '../../styles/Server.module.scss'
import { db } from '../../modules/firebase'
import { getDocs, query, where, collection, limit } from 'firebase/firestore'

export default function Server() {
    const [orderform, setOrderform] = useState(null)
    const [orderformId, setOrderformId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')

    useEffect(() => {   
        if(typeof window !== 'undefined') {
            const orderform = JSON.parse(window.localStorage.getItem('orderform')) || null
    
            setOrderform(orderform)
            setOrderformId(orderform ? orderform.id : null)
        }
    }, [isLoading])


    // Local 
    function secToDate(sec) {
        return String(new Date(sec * 1000))
    }

    function clearOrderform() {
        if(typeof window !== undefined) {
            window.localStorage.removeItem('orderform')
        }
        setOrderform(null)
    }



    // From the firebase server
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
            {
                isLoading ? <div>Downloading orderform from the server...</div> :
                <div>
                    <Link href='/'><a href='/'>Home &rarr;</a></Link>
                {
                    !orderform ? 
                    <form onSubmit={getOrderform}>
                        <h2>You have no orderform downloaded to your device.</h2>
                        <br/>
                        <p>Download the orderform by typing the unique id of the orderform</p>
                        <br/>
                        <br/>
                        <input onChange={e => setOrderformId(e.target.value)} type='text' placeholder="Order Id" value={orderformId} required/><span>&nbsp;</span>
                        <button type='submit'>get orderform</button>
                    </form> :
                    <div className={styles.curr_orderform}>
                        <h2>Current Orderform</h2>
                        <br/>
                        <p><strong>Business Name:</strong> { orderform.businessName }</p>
                        <p><strong>Orderform Id:</strong> { orderform.id }</p>
                        <p><strong>Last Updated Date:</strong> { secToDate(orderform.updated.seconds) }</p>
                        <br/>
                        <button className={styles.update_btn} onClick={getOrderform}>update</button><span>&nbsp;</span>
                        <button className={styles.reset_btn} onClick={clearOrderform}>reset</button>
                    </div>
                }
                <br/>
                <br/>
                {
                    orderform &&
                    <div className={styles.orderform}>
                         <h1>Orderpad</h1>
                        <br/>
                        <div className={styles.category_container}> 
                            {
                                orderform.category.map((category, i) => 
                                    <button 
                                        style={{ 
                                            backgroundColor: category === selectedCategory ? 'black' : 'transparent',
                                            color:  category === selectedCategory ? 'white' : 'black'
                                        }}
                                        onClick={() => setSelectedCategory(category)}
                                        key={i}>{ category }</button>)
                            }
                        </div>
                        <br/>
                        <br/>
                        <div className={styles.item_container}>
                            {
                                orderform.item.map((item, i) => item.category === selectedCategory &&
                                    <div style={{ backgroundColor: item.color }} className={styles.item} key={i}>
                                        <span>{ item.name } ${ item.price }&nbsp;</span>
                                        {
                                            item.options.length > 0 &&
                                            <Modal btn_name='options'>
                                                <div className={styles.item_options}>
                                                    <h4>Options</h4>
                                                    <br/>
                                                    {
                                                        item.options.map((option ,i) => <p key={i}>{ option.name }(+${ option.charge })</p>)
                                                    }
                                                </div>
                                            </Modal>
                                        }
                                    </div>)
                            }
                        </div>
                    </div>
                }
                </div>
            }
        </ServerLayout>
    )   
}