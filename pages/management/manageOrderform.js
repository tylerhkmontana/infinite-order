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
    const [selectedFilter, setSelectedFilter] = useState('')
    const [newCategories, setNewCategories] = useState([])
    const [newFilters, setNewFilters] = useState([])
    const [newKeywords, setNewKeywords] = useState([])
    const [newOption, setNewOption] = useState({
        name: '',
        charge: 0
    })
    const [newItem, setNewItem] = useState({
        name: '',
        price: 0,
        category: '',
        filters: {},
        options: []
    })

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

    // Local update
    function addCategory(e) {
        e.preventDefault()
        const newCategory = (e.target.firstChild.value).toLowerCase()
        if (newCategories.includes(newCategory) || orderform.category.includes(newCategory)) {
            console.log("this category already exists")
        } else {
            setNewCategories(prev => [...prev, newCategory])
            e.target.firstChild.value = ''
        }
    }

    function addFilter(e) {
        e.preventDefault()
        const newFilter = (e.target.firstChild.value).toLowerCase()
        if (newFilters.includes(newFilter) || Object.keys(orderform.filter).includes(newFilter)) {
            console.log("this filter already exsits")
        } else {
            setNewFilters(prev => [...prev, newFilter])
            e.target.firstChild.value = ''
        }
    }

    function addKeyword(e) {
        e.preventDefault()
        const newKeyword = (e.target.firstChild.value).toLowerCase()
        if (newKeywords.includes(newKeyword) || orderform.filter[selectedFilter].includes(newKeyword)) {
            console.log("this keyword already exsits")
        } else {
            setNewKeywords(prev => [...prev, newKeyword])
            e.target.firstChild.value = ''
        }
    }

    function addOption() {
        if (newOption.name) {
            let currOptions = [...newItem.options]
            currOptions.push(newOption)
            setNewItem(prev => ({
                ...prev,
                options: currOptions
            }))

            setNewOption({
                name: '',
                charge: 0
            })
        } else {
            console.log('no name given')
        }
    }

    function updateFilterOfItem(event, filter, keyword) {
        let currFilters = {
            ...newItem.filters
        }
        if(!Object.keys(currFilters).includes(filter)) {
            currFilters[filter] = []
        }
        let currKeywords = [...currFilters[filter]]
        event.target.checked ? currKeywords.push(keyword) :
            currKeywords.splice(currKeywords.indexOf(keyword), 1) 

        setNewItem(prev => ({
            ...prev,
            filters: {
                ...currFilters,
                [filter]: currKeywords
            }
        }))
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

     async function updateFilter() {
        setIsLoading(true)
        if(newFilters.length > 0) {
            let updatedFilters = {...orderform.filter}
            newFilters.forEach(f => {
                updatedFilters[f] = []
            })

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

    async function updateKeyword() {
        setIsLoading(true)
        if(newKeywords.length > 0 && selectedFilter) {
            let currKeywords = [...orderform.filter[selectedFilter]]
            let updatedKeywords = currKeywords.concat(newKeywords)
            let currFilter = {...orderform.filter}
            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()

            await updateDoc(orderformRef, {
                filter: {
                    ...currFilter,
                    [selectedFilter]: updatedKeywords
                },
                updated
            })
            setOrderform(prev => ({
                ...prev,
                filter: {
                    ...currFilter,
                    [selectedFilter]: updatedKeywords
                },
                updated
            }))
            setNewKeywords([])
        }
        setIsLoading(false)
    }

    async function updateItem(e) {
        e.preventDefault()
        let updatingItem = {
            ...newItem,
            category: selectedCategroy
        }
        console.log(updatingItem)
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

                                            <div className={styles.currCategories}>
                                                <h4>Current categories:</h4> 
                                                <div>
                                                    {
                                                        orderform.category.length > 0 ?
                                                            orderform.category.map((c, i) => <span key={i}>{ c }</span>) :
                                                            <p>empty</p>
                                                    }
                                                </div>
                                            </div>
                                        
                                            <div className={styles.newCategories}>
                                                <h4>Newly added categories:</h4>     
                                                <div>
                                                    {
                                                        newCategories.map((nc, i) =><span style={{ color: 'blue' }} key={i}>{ nc }</span>) 
                                                    }
                                                    <form onSubmit={addCategory}>
                                                        <input type='text' placeholder='category name' required/>
                                                        <button type='submit'>add</button>
                                                    </form>
                                                </div>                         
                                                <button onClick={updateCategory}>Update</button>
                                            </div>
                                        </div>

                                        <div className={styles.filter}> 
                                            <h3>Filter</h3>

                                            <div className={styles.currFilters}>
                                                <h4>Current Filtes:</h4> 
                                                <div>
                                                    {
                                                        Object.keys(orderform.filter).length > 0 ?
                                                            Object.keys(orderform.filter).map((f, i) => <button style={{ backgroundColor: selectedFilter === f ? 'crimson' : 'inherit' }} onClick={() => setSelectedFilter(f)} key={i}>{ f }</button>) :
                                                            <p>empty</p>
                                                    }
                                                </div>
                                                {
                                                    selectedFilter &&
                                                    <div>
                                                        <h4>Keywords: { selectedFilter }</h4>
                                                        {
                                                            orderform.filter[selectedFilter].map((keyword, i) => <span key={i}>{ keyword }</span>)
                                                        }
                                                        {
                                                            newKeywords.map((nk, i) => <span style={{ color: 'blue' }} key={i}>{ nk }</span>)
                                                        }
                                                        <form onSubmit={addKeyword}>
                                                            <input type='text' placeholder='keyword name' required/>
                                                            <button type='submit'>add</button>
                                                        </form>
                                                        <button onClick={updateKeyword}>update</button>
                                                    </div>
                                                }
                                            </div>
                                        
                                            <div className={styles.newFilters}>
                                                <h4>Newly added filters:</h4>        
                                                <div>
                                                    {
                                                        newFilters.map((nf, i) =><span style={{ color: 'blue' }} key={i}>{ nf }</span>) 
                                                    }
                                                    <form onSubmit={addFilter}>
                                                        <input type='text' placeholder='filter name' required/>
                                                        <button type='submit'>add</button>
                                                    </form>
                                                </div>
                                                <button onClick={updateFilter}>Update</button>
                                            </div>              
                                        </div>

                                        <div className={styles.item}>
                                            <h3>Item</h3>
                                            {
                                                orderform.category.length > 0 ? 
                                                <div>
                                                    <div className={styles.select_category}>
                                                        <h4>Select Category</h4>
                                                        <div>
                                                            {
                                                                orderform.category.map((c, i) => 
                                                                <button style={{ backgroundColor: selectedCategroy === c ? 'crimson' : 'inherit' }} onClick={() => setSelectedCategory(c)} key={i}>{ c }</button>)
                                                            }
                                                        </div>
                                                    </div> 

                                                    <div className={styles.item_container}>
                                                        <div className={styles.curr_items}>
                                                            {
                                                                orderform.item.map((item, i) => item.category === selectedCategroy && <p key={i}>{ item.name }</p>)
                                                            }
                                                        </div>
                                                        {
                                                            selectedCategroy && 
                                                            <form onSubmit={updateItem} className={styles.newItem_form}>
                                                                <h4>New Item</h4>
                                                                <p>Selected Category: <strong>{ selectedCategroy }</strong></p>
                                                                <input onChange={(e) => setNewItem(prev => ({
                                                                    ...prev,
                                                                    name: e.target.value
                                                                }))} type='text' placeholder='name' required/>
                                                                <input onChange={(e) => setNewItem(prev => ({
                                                                    ...prev,
                                                                    price: e.target.value
                                                                }))} type='number' placeholder='price' required/>
                                                                <div>
                                                                    <h4>Filters</h4>
                                                                    <hr/>
                                                                    <br/>
                                                                    {
                                                                        Object.keys(orderform.filter).map((f, i) => 
                                                                        <div key={i}>
                                                                            <h4>{ f }</h4>   
                                                                            {
                                                                                orderform.filter[f].map(
                                                                                    (keyword, i) => 
                                                                                        <div key={i}>
                                                                                            <input onChange={(e) => updateFilterOfItem(e, f, keyword)} value={keyword} type='checkbox'/>
                                                                                            <label>{ keyword }</label>
                                                                                        </div>
                                                                                )
                                                                            } 
                                                                        </div>    
                                                                        )
                                                                    }
                                                                </div>
                                                                <br/>
                                                                <div>
                                                                    <h4>Options</h4>
                                                                    {
                                                                        newItem.options.map((option, i) => 
                                                                            <p key={i}>{ option.name }(+${ option.charge })</p>
                                                                        )
                                                                    }
                                                                    <div>
                                                                        <input onChange={e => setNewOption(prev => ({...prev, name: e.target.value}))} type='text' placeholder='option name'/>
                                                                        <input onChange={e => setNewOption(prev => ({...prev, charge: e.target.value}))} type='number' placeholder='option charge' defaultValue={0}/>
                                                                        <button type='button' onClick={addOption}>add option</button>
                                                                    </div>
                                                                    <hr/>
                                                                </div>
                                                                <button type='submit'>add item</button>
                                                            </form>
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