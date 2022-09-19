import styles from '../../styles/ManageOrderform.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '../../modules/firebase'
import { getDocs, setDoc, doc, query, where, collection, limit } from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'

export default function ManageOrderform() {
    const { user,isAuthenticated } = useAuthContext()
    const [orderform, setOrderform] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [categoryUpdate, setCategoryUpdate] = useState([])

    useEffect(() => {
        const getOrderform = async () => {
            if(user && isAuthenticated()) {
                const q = query(collection(db, "orderforms"), where("userId", "==", user.id), limit(1))
                let foundOrderform
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach(doc => {
                    foundOrderform = doc.data()
                })

                foundOrderform && setOrderform({...foundOrderform})
                setIsLoading(false)
            }
        }

        getOrderform()
    }, [user])

    async function initializeOrderform() {
        setIsLoading(true)
        if(user && isAuthenticated) {
            const orderformId = uuid4()
            const updated = new Date()
            const newOrderform = {
                id: orderformId,
                userId: user.id,
                updated: updated,
                category: [],
                filter: {},
                item: []
                }
            await setDoc(doc(db, "orderforms", orderformId), newOrderform);
            setOrderform({...newOrderform})
            setIsLoading(false)
        }
    }

    function addCategory(e) {
        e.preventDefault()
        const newCategory = e.target.firstChild.value
        setCategoryUpdate(prev => [...prev, newCategory])
        e.target.firstChild.value = ''
    }

    return(
        <ManagementLayout>
            {
                user ?  
                <div className={styles.dashboard}>
                        <Link href='/management'><a className={styles.back_btn} href='/management'>back to dashboard &rarr;</a></Link>
                        <h1>Manage Your Orderform</h1>
                        <h2>Welcome { user.name }</h2>
                        <h2>Business Name: { user.businessName }</h2>
                        {
                            isLoading ? 
                            <div>
                                Loading...
                            </div> :
                            <div className={styles.orderform_container}>
                                {
                                    orderform ? 
                                        <div className={styles.orderform_form}>
                                        <div className={styles.category}> 
                                            <h3>Category</h3>

                                            <h4>Current categories:</h4> 
                                            <div className={styles.category_list}>
                                                {
                                                    orderform.category.length > 0 ?
                                                        orderform.category.map((c, i) => <div key={i}>{ c }</div>) :
                                                        <p>empty</p>
                                                }
                                            </div>
                                        
                                            <h4>Newly added categories:</h4>                              
                                            <div className={styles.categoryUpdate_list}>
                                                {
                                                    categoryUpdate.map((cu, i) =><span key={i}>{ cu }</span>) 
                                                }
                                                    <form onSubmit={addCategory}>
                                                    <input type='text' placeholder='category name' required/>
                                                    <button type='submit'>add</button>
                                                </form>
                                            </div>
                                        </div>

                                        <div className={styles.item}>
                                            
                                        </div>
                                    </div> :
                                    <div>
                                        <h3>You have no orderform</h3>
                                        <button onClick={initializeOrderform}>Initialize</button>
                                    </div>
                                }

                            </div>
                        }
                    </div> :
                <div>redirecting...</div>
            }
        </ManagementLayout>
    )
}