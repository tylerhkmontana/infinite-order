import styles from '../../styles/ManageOrderform.module.scss'
import { useAuthContext } from '../../context/authContext'
import ManagementLayout from '../../components/managementLayout'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '../../modules/firebase'
import { getDocs, setDoc, updateDoc, doc, query, where, collection, limit } from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'

export default function ManageOrderform() {
    const { user, isAuthenticated } = useAuthContext()
    const [orderform, setOrderform] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategroy, setSelectedCategory] = useState('')
    const [newCategories, setNewCategories] = useState([])
    const [newFilters, setNewFilters] = useState([])

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
                filter: [],
                item: [],
                keywords: []
                }
            await setDoc(doc(db, "orderforms", orderformId), newOrderform);
            setOrderform({...newOrderform})
            setIsLoading(false)
        }
    }

    // Local update
    function addCategory(e) {
        e.preventDefault()
        const newCategory = e.target.firstChild.value
        setNewCategories(prev => [...prev, newCategory])
        e.target.firstChild.value = ''
    }

    function addFilter(e) {
        e.preventDefault()
        const newFilter = e.target.firstChild.value
        setNewFilters(prev => [...prev, newFilter])
        e.target.firstChild.value = ''
    }

    function addKeyword() {
        
    }

    // Firestore update
    async function updateCategory() {
        setIsLoading(true)
        if(newCategories.length > 0) {
            const currCategories = [...orderform.category]
            const updatedCategories = currCategories.concat(newCategories)
            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()

            await updateDoc(orderformRef, {
                category: updatedCategories,
                updated
            })
            setOrderform(prev => ({
                ...prev,
                category: updatedCategories,
                updated
            }))
            setNewCategories([])
        }
        setIsLoading(false)
    }

     // Firestore update
     async function updateFilter() {
        setIsLoading(true)
        if(newFilters.length > 0) {
            const currFilters = [...orderform.filter]
            const updatedFilters = currFilters.concat(newFilters)
            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()

            await updateDoc(orderformRef, {
                filter: updatedFilters,
                updated
            })
            setOrderform(prev => ({
                ...prev,
                filter: updatedFilters,
                updated
            }))
            setNewFilters([])
        }
        setIsLoading(false)
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
                                            <div className={styles.currCategories}>
                                                {
                                                    orderform.category.length > 0 ?
                                                        orderform.category.map((c, i) => <div key={i}>{ c }</div>) :
                                                        <p>empty</p>
                                                }
                                            </div>
                                        
                                            <h4>Newly added categories:</h4>                              
                                            <div className={styles.newCategories}>
                                                {
                                                    newCategories.map((nc, i) =><span key={i}>{ nc }</span>) 
                                                }
                                                    <form onSubmit={addCategory}>
                                                    <input type='text' placeholder='category name' required/>
                                                    <button type='submit'>add</button>
                                                </form>
                                            </div>
                                            <button onClick={updateCategory}>Update</button>
                                        </div>

                                        <div className={styles.filter}> 
                                            <h3>Filter</h3>

                                            <h4>Current Filters:</h4> 
                                            <div className={styles.currFilters}>
                                                {
                                                    orderform.filter.length > 0 ?
                                                        orderform.filter.map((f, i) => <div key={i}>{ f }</div>) :
                                                        <p>empty</p>
                                                }
                                            </div>
                                        
                                            <h4>Newly added filters:</h4>                              
                                            <div className={styles.newFilters}>
                                                {
                                                    newFilters.map((nf, i) =><span key={i}>{ nf }</span>) 
                                                }
                                                    <form onSubmit={addFilter}>
                                                    <input type='text' placeholder='filter name' required/>
                                                    <button type='submit'>add</button>
                                                </form>
                                            </div>
                                            <button onClick={updateFilter}>Update</button>
                                        </div>

                                        <div className={styles.item}>
                                            <h3>Item</h3>
                                            <h4>Select Category</h4>
                                            {
                                                orderform.category.length > 0 ? 
                                                <div>
                                                    <div className={styles.select_category}>
                                                        {
                                                            orderform.category.map((c, i) => 
                                                            <button style={{ backgroundColor: selectedCategroy === c ? 'crimson' : 'inherit' }} onClick={() => setSelectedCategory(c)} key={i}>{ c }</button>)
                                                        }
                                                    </div> 
                                                </div> :
                                                <div>
                                                    You have no category yet.
                                                </div>
                                            }
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