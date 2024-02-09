import styles from '../styles/Management.module.scss'
import { useAuthContext } from '../context/authContext'
import ManagementLayout from '../components/managementLayout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../modules/firebase'
import { getDocs, setDoc, updateDoc, deleteDoc, doc, query, where, collection, limit } from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'
import Modal from '../components/modal'

export default function Management() {
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuthContext()
    const [isLoading, setIsLoading] = useState(true)
    const [orderform, setOrderform] = useState(null)
    const [newAllergies, setNewAllergies] = useState([])
    const [newCategories, setNewCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [newOption, setNewOption] = useState({
        name: '',
        charge: 0
    })
    const [newItem, setNewItem] = useState({
        id: null,
        name: '',
        color: '#f1f1f1',
        price: 0,
        description: '',
        category: '',
        allergies: [],
        options: []
    })
    const [currItemOrder, setCurrItemOrder] = useState([])
    const [newItemOrder, setNewItemOrder] = useState([])

    useEffect(() => {
        const getOrderform = async () => {
            if(user && isAuthenticated()) {
                try {
                    const q = query(collection(db, "orderforms"), where("userId", "==", user.uid), limit(1))
                    let foundOrderform
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach(doc => {
                        foundOrderform = doc.data()
                    })
    
                    foundOrderform && setOrderform({...foundOrderform})
                } catch (err) {
                    console.error(err)
                    router.push('/500')
                }
                setIsLoading(false)
            }
        }

        setNewItem({
            id: null,
            name: '',
            color: '#f1f1f1',
            price: 0,
            description: '',
            category: '',
            allergies: [],
            options: []
        })

        getOrderform()
    }, [user])


    // Initialize and Delete Orderform
    async function initializeOrderform(e) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target);
        const { businessName } = Object.fromEntries(formData);
        if(user && isAuthenticated()) {
            const orderformId = uuid4()
            const updated = new Date()
            const newOrderform = {
                id: orderformId,
                businessName: businessName,
                userId: user.uid,
                updated: updated,
                category: [],
                allergy: [],
                item: []
                }
            await setDoc(doc(db, "orderforms", orderformId), newOrderform);
            setOrderform({...newOrderform})
        }
        setIsLoading(false)
    }

    async function deleteOrderform() {
        setIsLoading(true)
        if(orderform && isAuthenticated()) {
            try {
                await deleteDoc(doc(db, "orderforms", orderform.id)); 
                setOrderform(null)
                console.log('Orderform has been successfully deleted.')
            } catch (err) {
                console.log("Failed to delete the orderform.")
                console.error(err)
            }
        }
        setIsLoading(false)
    }

    // Local Update
    function addAllergy(e) {
        e.preventDefault()
        const newAllergy = (e.target.firstChild.value).toLowerCase()
        if (newAllergies.includes(newAllergy) || orderform.allergy.includes(newAllergy)) {
            console.log("this filter already exsits")
        } else {
            setNewAllergies(prev => [...prev, newAllergy])
            e.target.firstChild.value = ''
        }
    }

    function addCategory(e) {
        e.preventDefault()
        const newCategory = (e.target.firstChild.value).toLowerCase()
        if (newCategories.includes(newCategory) || orderform.category.includes(newCategory)) {
            console.log("this filter already exsits")
        } else {
            setNewCategories(prev => [...prev, newCategory])
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

    function updateAllergyOfItem(event) {
        const allergy = event.target.value
        let currAllergies = [...newItem.allergies]
        event.target.checked ? 
            currAllergies.push(allergy) :
            currAllergies.splice(currAllergies.indexOf(allergy), 1) 

        setNewItem(prev => ({
            ...prev,
            allergies: currAllergies
        }))
    }

    function selectCategory(category) {
        setSelectedCategory(category)
        setNewItem({
            id: null,
            name: '',
            price: 0,
            color: "#f1f1f1",
            category: '',
            allergies: [],
            options: []
        })
        const currOrder = orderform.item.filter(item => item.category === category)
        setCurrItemOrder([...currOrder])
        setNewItemOrder([])
    }

    function reorganizeItemOrder(item) {
        if(currItemOrder.length > 0) {
            let selectedItemIndex
            currItemOrder.find((itm, i) => {
                if(itm.id === item.id) selectedItemIndex = i
            })
    
            let newCurrItemOrder = [...currItemOrder]
            newCurrItemOrder.splice(selectedItemIndex, 1)
            setNewItemOrder(prev => [...prev, item])
            setCurrItemOrder(newCurrItemOrder)
        }
    }

    function resetItemOrder() {
        if(selectedCategory) {
            const currOrder = orderform.item.filter(item => item.category === selectedCategory)
            setCurrItemOrder([...currOrder])
            setNewItemOrder([])
        }
    }

    // Firestore Update

    // Update
    async function updateAllergy() {
        setIsLoading(true)
        if(newAllergies.length > 0 && isAuthenticated()) {
            let updatedAllergies = [...orderform.allergy, ...newAllergies]

            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()

            try {
                await updateDoc(orderformRef, {
                    allergy: updatedAllergies,
                    updated
                })
                setOrderform(prev => ({
                    ...prev,
                    allergy: updatedAllergies,
                    updated
                }))
                setNewAllergies([])
            } catch (err) {
                console.log("failed to update allergy")
                console.error(err)
            }
           
        }
        setIsLoading(false)
    }

    async function updateCategory() {
        setIsLoading(true)
        if(newCategories.length > 0 && isAuthenticated()) {
            let updatedCategories = [...orderform.category, ...newCategories]

            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()

            try {
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
            } catch (err) {
                console.log("failed to update category")
                console.error(err)
            }
           
        }
        setIsLoading(false)
    }

    async function addItem(e) {
        e.preventDefault()
        setIsLoading(true)
        let updatingItem = {
            ...newItem,
            id: uuid4(),
            category: selectedCategory
        }
        const currItems = [...orderform.item]
        
        if(isAuthenticated()) {
            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()
            try {
                await updateDoc(orderformRef, {
                    item: [
                        ...currItems,
                        updatingItem
                    ],
                    updated
                })
                setOrderform(prev => ({
                    ...prev,
                    item: [
                        ...currItems,
                        updatingItem
                    ],
                    updated
                }))
                setNewItem({
                    id: null,
                    name: '',
                    description: '',
                    price: 0,
                    color:'#f1f1f1',
                    category: '',
                    allergies: [],
                    options: []
                })
            } catch (err) {
                console.log('failed to add the item')
                console.error(err)
            }
        }
        setIsLoading(false)
    }

    async function updateItem(e) {
        setIsLoading(true)
        e.preventDefault()
        let currItems = [...orderform.item]
        let foundIndex

        currItems.find((item, i) => {
            foundIndex = i
            return item.id === newItem.id
        })

        currItems[foundIndex] = {
            ...newItem
        }

        if(isAuthenticated()) {
            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()
            try {
                await updateDoc(orderformRef, {
                    item: currItems,
                    updated
                })
                setOrderform(prev => ({
                    ...prev,
                    item: currItems,
                    updated
                }))
                setNewItem({
                    id: null,
                    name: '',
                    price: 0,
                    color: '#f1f1f1',
                    description: '',
                    category: '',
                    allergies: [],
                    options: []
                })
            } catch (err) {
                console.log('failed to add the item')
                console.error(err)
            }
        }
        setIsLoading(false)
    }

    async function updateItemOrder() {
        setIsLoading(true)
        if(selectedCategory && currItemOrder.length < 1) {
            const itemIdList = newItemOrder.map(item => item.id)

            const nonUpdatingItems = orderform.item.filter(item => !itemIdList.includes(item.id))
            const newItemList = [...nonUpdatingItems, ...newItemOrder]

            if(isAuthenticated()) {
                const orderformRef = doc(db, "orderforms", orderform.id)
                const updated = new Date()
                try {
                    await updateDoc(orderformRef, {
                        item: newItemList,
                        updated
                    })
                    setOrderform(prev => ({
                        ...prev,
                        item: newItemList,
                        updated
                    }))
                } catch (err) {
                    console.log('failed to update the item order')
                    console.error(err)
                }

                setCurrItemOrder([])
                setNewItemOrder([])
                setSelectedCategory('')
            }
        } else {
            console.log("Failed to update item order")
            console.error('Either you did not select a category or did not complete new item order')
        }

        setIsLoading(false)
    }

    // Remove
    async function deleteAllergy(allergy) {
        setIsLoading(true)
        if(isAuthenticated() && orderform.allergy.includes(allergy)) {
            let updatedAllergies = [...orderform.allergy]
            let updatedItems = [...orderform.item]
            updatedAllergies.splice(updatedAllergies.indexOf(allergy), 1)

            updatedItems = updatedItems.map(item => {
                if(item.allergies.includes(allergy)) {
                    let allergies = [...item.allergies]
                    allergies.splice(allergies.indexOf(allergy), 1)
                    item.allergies = allergies
                }

                return item
            })
            
            try {
                const orderformRef = doc(db, "orderforms", orderform.id)
                const updated = new Date()
                await updateDoc(orderformRef, {
                    allergy: updatedAllergies,
                    item: updatedItems,
                    updated
                })
                setOrderform(prev => ({
                    ...prev,
                    allergy: updatedAllergies,
                    item: updatedItems,
                    updated
                }))
                setNewAllergies([])
            } catch (err) {
                console.log("failed to update allergy")
                console.error(err)
            }
           
        }
        setIsLoading(false)
    }

    async function deleteCategory(category) {
        setIsLoading(true)
        if(isAuthenticated() && orderform.category.includes(category)) {
            let updatedCategories = [...orderform.category]
            let updatedItems = [...orderform.item]
            updatedCategories.splice(updatedCategories.indexOf(category), 1)

            updatedItems = updatedItems.filter(item => item.category !== category)

            try {
                const orderformRef = doc(db, "orderforms", orderform.id)
                const updated = new Date()
                await updateDoc(orderformRef, {
                    category: updatedCategories,
                    item: updatedItems,
                    updated
                })
                setOrderform(prev => ({
                    ...prev,
                    category: updatedCategories,
                    item: updatedItems,
                    updated
                }))
                setNewCategories([])
            } catch (err) {
                console.log("failed to update category")
                console.error(err)
            }
           
        }
        setIsLoading(false)
    }

    async function deleteItem(itemId) {
        setIsLoading(true)
        let currItems = [...orderform.item]
        currItems = currItems.filter(item => item.id !== itemId)
        if(isAuthenticated()) {
            const orderformRef = doc(db, "orderforms", orderform.id)
            const updated = new Date()
    
            try {
                await updateDoc(orderformRef, {
                    item: currItems,
                    updated
                })
                setOrderform(prev => ({
                    ...prev,
                    item: currItems,
                    updated
                }))
                setNewItem({
                    id: null,
                    color: '#f1f1f1',
                    name: '',
                    price: 0,
                    description: '',
                    category: '',
                    allergies: [],
                    options: []
                })
                setNewCategories([])
            } catch (err) {
                console.log("failed to update category")
                console.error(err)
            }
        }

        setIsLoading(false)
    }   
    
    return(
        <ManagementLayout>
            {
                user ?  
                <div className={styles.dashboard}>
                    <div className={styles.profile}>
                        <div className={styles.profile_btn_group}>
                            <Link href='/'><a>Home </a></Link>
                            <span>|</span>
                            <a href='#' onClick={logout}>Logout</a>
                        </div>
                        <h3>[Management Page]</h3>
                    </div>
                    {
                        isLoading ? 
                            <div>Loading...</div> :
                            <div className={styles.orderform_container}>
                                {
                                    !orderform ? 
                                        <form onSubmit={initializeOrderform} className={styles.initialize_orderform}>
                                            <h2>You currently have no orderform</h2>
                                            <p>Type your business name below and initialize your orderform for your business.</p>
                                            <input type='text' placeholder='business name' name='businessName' required/>
                                            <button>Initialize Orderform</button>
                                        </form> :
                                        <div className={styles.orderform}>
                                            {/* Delete Orderform */}
                                            <div className={styles.delete_orderform_container}>
                                                <Modal color='white' backgroundColor='crimson' btn_name='Delete Orderform'>
                                                    <div className={styles.delete_orderform}>
                                                        <h2>Delete Orderform</h2>
                                                        <p>Do you really want to delete your current orderform?</p>
                                                        <button onClick={deleteOrderform}>Confirm</button>
                                                    </div>
                                                </Modal>
                                            </div>

                                            <div className={styles.business_name}>
                                                <p><strong>User Name:</strong> { user.name }</p>
                                                <p><strong>Business Name:</strong> { orderform.businessName }</p>
                                                <p><strong>Orderform Id:</strong> { orderform.id }</p>
                                            </div>
                                            <br/>
                                            
                                            {/* Allergy */}
                                            <div className={styles.allergy_container}>
                                                <h2>Allergy Chart</h2>
                                                <br/>
                                                <br/>
                                                <h3>New Allergy List</h3>
                                                <br/>
                                                <div className={styles.new_allergy}>
                                                    {
                                                        newAllergies.map((na, i) => <span className={styles.item_wrapper} key={i}>{ na }</span>)
                                                    }
                                                    <form onSubmit={addAllergy}>
                                                        <input type='text' placeholder='allergy name' required/><span>&nbsp;</span>
                                                        <button>add allergy</button>
                                                    </form>
                                                </div>
                                                <br/>
                                                <div>
                                                    <button onClick={updateAllergy}>update</button><span>&nbsp;</span>
                                                    <button className={styles.reset_btn} onClick={() => setNewAllergies([])}>reset</button>
                                                </div>
                                                <br/>
                                                <br/>
                                                <h3>Current Allergy List</h3>
                                                <br/>
                                                <div className={styles.curr_allergy}>
                                                    {
                                                        orderform.allergy.length < 1 ?
                                                            <p>Empty</p> :
                                                            orderform.allergy.map((allergy, i) => 
                                                            <div className={styles.item_wrapper} style={{ display: 'flex', alignItems: 'center' }} key={i}>
                                                                <span>{ allergy }</span><span>&nbsp;</span>
                                                                <Modal btn_name='X' btn_style={{
                                                                    border: 'none'
                                                                }}>
                                                                    <div className={styles.delete_allergy}>
                                                                        <h2>Delete Allergy &quot;{ allergy }&quot;</h2>
                                                                        <p>Do you really want to remove this allergy from your allergy list?</p>
                                                                        <button onClick={() => deleteAllergy(allergy)}>confirm</button>
                                                                    </div>
                                                                </Modal>
                                                            </div>
                                                            )
                                                    }
                                                </div>  
                                            </div>

                                            <br/>
                                            <br/>

                                            {/* Category */}
                                            <div className={styles.category_container}>
                                                <h2>Category</h2>
                                                <br/>
                                                <br/>
                                                <h3>New Category List</h3>
                                                <br/>
                                                <div className={styles.new_category}>
                                                    {
                                                        newCategories.map((na, i) => <span className={styles.item_wrapper} key={i}>{ na }</span>)
                                                    }
                                                    <form onSubmit={addCategory}>
                                                        <input type='text' placeholder='category name' required/><span>&nbsp;</span>
                                                        <button>add category</button>
                                                    </form>
                                                </div>
                                                <br/>
                                                <div>
                                                    <button onClick={updateCategory}>update</button><span>&nbsp;</span>
                                                    <button className={styles.reset_btn} onClick={() => setNewCategories([])}>reset</button>
                                                </div>
                                                <br/>
                                                <br/>
                                                <h3>Current Category List</h3>
                                                <br/>
                                                <div className={styles.curr_category}>
                                                    {
                                                        orderform.category.length < 1 ?
                                                            <p>Empty</p> :
                                                            orderform.category.map((category, i) => 
                                                            <div style={{ display: 'flex', alignItems: 'center' }} key={i}>
                                                                <span className={styles.item_wrapper}>{ category }</span><span>&nbsp;</span>
                                                                <Modal btn_name='delete' color='white' backgroundColor='crimson'>
                                                                    <div className={styles.delete_category}>
                                                                        <h2>Delete Category &quot;{ category }&quot;</h2>
                                                                        <p>
                                                                            Do you really want to remove this category from your category list? All the items associated with the 
                                                                            category will be deleted as well.
                                                                        </p>
                                                                        <button onClick={() => deleteCategory(category)}>confirm</button>
                                                                    </div>
                                                                </Modal>
                                                            </div>
                                                            )
                                                    }
                                                </div>
                                            </div>

                                            <br/>
                                            <br/>

                                            {/* Item */}
                                            <div className={styles.item_container}>
                                                <h2>Item</h2>
                                                <br/>
                                                <br/>
                                                <h3>Select Category</h3>
                                                <br/>
                                                <div className={styles.select_category}>    
                                                    {
                                                        orderform.category.map((category, i) => 
                                                        <button 
                                                            onClick={() => selectCategory(category)}
                                                            style={{ 
                                                                backgroundColor: selectedCategory === category && '#121212',
                                                                color: selectedCategory === category && 'white'
                                                            }} 
                                                            key={i}>
                                                                { category }
                                                        </button>
                                                        )
                                                    }
                                                </div>
                                                <br/>
                                                <div className={styles.curr_items}>
                                                    {
                                                        orderform.item.map((item, i) => item.category === selectedCategory && 
                                                        <div style={{ display: 'flex', alignItems: 'center' }} key={i}>
                                                            <span style={{ backgroundColor: item.color }} className={styles.item_wrapper} key={i}>${ item.price } { item.name }</span><span>&nbsp;</span>
                                                            <button onClick={() => setNewItem({...item})}>update</button><span>&nbsp;</span>
                                                            <Modal btn_name='delete' color='white' backgroundColor='crimson'>
                                                                <div className={styles.delete_item}>
                                                                    <h2>Delete Item &quot;{ item.name }&quot;</h2>
                                                                    <p>Do you really want to remove this item from the selected category?</p>
                                                                    <button onClick={() => deleteItem(item.id)}>confirm</button>
                                                                </div>
                                                            </Modal>
                                                        </div>)
                                                    }
                                                </div>
                                                <br/>
                                                {
                                                    selectedCategory && 
                                                    <form onSubmit={(e) => newItem.id ? updateItem(e) : addItem(e)} className={styles.newItem_form}>
                                                        <h3>{
                                                            newItem.id ? 'Update Item' : 'Add New Item'
                                                        }</h3>
                                                        <br/>
                                                        <hr/>
                                                        <br/>
                                                        <p><strong>Category:</strong> { selectedCategory }</p>
                                                        <br/>
                                                        <label>Name: </label>
                                                        <input onChange={(e) => setNewItem(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))} type='text' placeholder='name' value={newItem.name} required/>
                                                        <br/>
                                                        <br/>
                                                        <label>Price: </label>
                                                        <input onChange={(e) => setNewItem(prev => ({
                                                            ...prev,
                                                            price: Number(e.target.value)
                                                        }))} type='number' placeholder='price' value={Number(newItem.price)} required/>
                                                        <br/>
                                                        <br/>
                                                        <textarea onChange={(e) => setNewItem(prev => ({
                                                            ...prev,
                                                            description: e.target.value
                                                        }))} type='text' placeholder='description' value={newItem.description}/>
                                                        <br/>
                                                        <br/>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <label>Button Color: </label><span>&nbsp;</span>
                                                            <input onChange={(e) => setNewItem(prev => ({
                                                                ...prev,
                                                                color: e.target.value
                                                            }))} value={newItem.color} type='color'/>
                                                        </div>
                                                        <br/>
                                                        <br/>
                                                        <hr/>
                                                        <br/>
                                                        <div>
                                                            <h4>Allergy</h4>
                                                            <br/>
                                                            {
                                                                orderform.allergy.map((allergy, i) => 
                                                                    <div style={{ display: 'flex', alignItems: 'center' }} key={i}>
                                                                        <input onChange={updateAllergyOfItem} value={allergy} type='checkbox' checked={newItem.allergies.includes(allergy)}/><span>&nbsp;</span>
                                                                        <label>{ allergy }</label>
                                                                    </div>)   
                                                            }
                                                        </div>
                                                        <br/>
                                                        <hr/>
                                                        <br/>
                                                        <div>
                                                            <h4>Options</h4>
                                                            <br/>
                                                            <div>
                                                                {
                                                                    newItem.options.length > 0 ? 
                                                                    <div>
                                                                        {
                                                                            newItem.options.map((option, i) => 
                                                                                <p key={i}>- { option.name }(+${ option.charge })</p>
                                                                            )
                                                                        }
                                                                    </div> :
                                                                    <div>
                                                                        No option added.
                                                                    </div>
                                                                }
                                                                <br/>
                                                                <label>Option Name: </label>
                                                                <input onChange={e => setNewOption(prev => ({...prev, name: e.target.value}))} type='text' placeholder='option name' value={newOption.name}/>
                                                                <br/>
                                                                <label>Option Charge: </label>
                                                                <input onChange={e => setNewOption(prev => ({...prev, charge: Number(e.target.value)}))} type='number' placeholder='option charge' value={newOption.charge}/>
                                                                <br/>
                                                                <br/>
                                                                <button type='button' onClick={addOption}>add option</button><span>&nbsp;</span>
                                                                <button className={styles.reset_btn} type='button' onClick={() => setNewItem(prev => ({...prev, options: []}))}>reset</button>
                                                            </div>
                                                            <br/>
                                                        </div>
                                                        <br/>
                                                        <hr/>
                                                        <br/>
                                                        <button className={styles.add_item_btn} type='submit'>Add Item</button>
                                                    </form>
                                                }
                                                <br/>
                                                <br/>
                                                <br/>
                                                {
                                                    selectedCategory &&
                                                    <div>
                                                        <h3>Reorganize the order of the items</h3>
                                                        <br/>
                                                        <br/>
                                                        <h4>Current Order of the items</h4>
                                                        <br/>
                                                        <div className={styles.curr_item_order}>
                                                        {
                                                            currItemOrder.map((item, i) => <span className={styles.item_wrapper} onClick={() => reorganizeItemOrder(item)} key={i}>{ item.name }</span>)
                                                        }
                                                        </div>
                                                        <br/>
                                                        <h4>New Order of the items</h4>
                                                        <br/>
                                                        <div className={styles.new_item_order}>
                                                        {
                                                            newItemOrder.map((item, i) => <span className={styles.item_wrapper} key={i}>{ item.name }</span>)
                                                        }
                                                        </div>
                                                        <br/>
                                                        <br/>
                                                        <div>
                                                            <button onClick={updateItemOrder}>update</button><span>&nbsp;</span>
                                                            <button className={styles.reset_btn} onClick={resetItemOrder}>reset</button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
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