import ServerLayout from "../../components/serverLayout"
import styles from '../../styles/UpdateTable.module.scss'
import Modal from "../../components/modal"
import secToTime from "../../modules/secToTime"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function UpdateTable() {
    const router = useRouter()
    const [table, setTable] = useState({})
    const [orderform, setOrderform] = useState({})
    const [selectedCategory, setSelectedCategory] = useState('')
    const [currOrder, setCurrOrder] = useState([])
    const [event, setEvent] = useState('')

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const { tableId } = router.query
            const tables = JSON.parse(window.localStorage.getItem('tables')) || {}
            const orderform = JSON.parse(window.localStorage.getItem('orderform')) || {}
    
            const prepareCurrOrder = orderform.item.map(item => ({...item, quantity: 0, delivered: false}))
            Object.keys(orderform).length > 0 && setCurrOrder([...prepareCurrOrder])
            setOrderform(orderform)
            setTable({...tables[tableId]})
        }
    }, [router.isReady])

    function addItem(targetItem) {
        const updatedOrder = currOrder.map(item => item.name === targetItem.name ? ({...item, quantity: item.quantity + 1}) : item)
        setCurrOrder([...updatedOrder])
    }

    function addItemWithOptions(e, targetItem) {
        e.preventDefault()
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);

        let currItem = {...targetItem}
        let selectedOptions = Object.keys(formProps).map(option => formProps[option])
        let options = ''
        selectedOptions.forEach((option, i) => {
            options += i > 0 ? `, ${option}` : option
        })

        const prevItemName = currItem.name
        currItem.name = selectedOptions.length > 0 ? `${currItem.name}(${options})` : currItem.name
        
        const foundItem = currOrder.find(item => item.name === currItem.name)
        let updatedOrder
        if(foundItem) { 
            updatedOrder = currOrder.map(item => item.name === currItem.name ? ({...item, quantity: item.quantity + 1}): item)
        } else {
            let foundIndex 
            currOrder.map((item, i) => {
                if(item.name === prevItemName) {
                    foundIndex = i
                }
            })

            updatedOrder = [...currOrder]
            updatedOrder.splice(foundIndex + 1, 0, {...currItem, quantity: 1, delivered: false})
        }
        setCurrOrder([...updatedOrder])
    }

    function decreaseItem(targetItem) {
        let updatedOrder = currOrder.map(item => item.name === targetItem.name ? ({...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0}) : item)
        setCurrOrder([...updatedOrder])
    }

    function increaseItem(targetItem) {
        let updatedOrder = currOrder.map(item => item.name === targetItem.name ? ({...item, quantity: item.quantity + 1}) : item)
        setCurrOrder([...updatedOrder])
    }

    function removeItem(targetItem) {
        let updatedOrder = currOrder.map(item => item.name === targetItem.name ? ({...item, quantity: 0}) : item)
        setCurrOrder([...updatedOrder])
    }

    function placeOrder() {
        let updatedAt = secToTime(new Date())
        let newOrder = {
            updatedAt,
            items: currOrder.filter(item => item.quantity > 0)
        }

        if(typeof window !== 'undefined' && newOrder.items.length > 0) {
            let tables = JSON.parse(window.localStorage.getItem('tables'))
            tables[table.tableId].orders.push(newOrder)

            window.localStorage.setItem('tables', JSON.stringify(tables))

            const prepareCurrOrder = orderform.item.map(item => ({...item, quantity: 0, delivered: false}))

            setTable({...tables[table.tableId]})
            setCurrOrder([...prepareCurrOrder])
        }
    }

    function updateAllergy(e) {
        e.preventDefault()
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        const allergies = Object.keys(formProps).map(allergy => formProps[allergy])

        if(typeof window !== 'undefined') {
            let tables = JSON.parse(window.localStorage.getItem('tables'))
            tables[table.tableId].allergies = allergies

            window.localStorage.setItem('tables', JSON.stringify(tables))
            setTable({...tables[table.tableId]})
        }
    }

    function allergyCheck(itemAllergies) {
        let checkedAllergies = itemAllergies.filter(alg => table.allergies.includes(alg)) 
        let allergyIndication = ''
        if (checkedAllergies.length > 0 ) {
            checkedAllergies.forEach((alg, i) => {
                allergyIndication += i > 0 ? `, ${alg}` : alg
            })
        }

        return allergyIndication ? `(${allergyIndication})` : ''
    }

    function updateEvent(e) {
        e.preventDefault()

        if(typeof window !== 'undefined') {
            let tables = JSON.parse(window.localStorage.getItem('tables'))
            tables[table.tableId].event = event

            window.localStorage.setItem('tables', JSON.stringify(tables))
            setTable({...tables[table.tableId]})
        }
    }

    return (
        <ServerLayout>
            {
                Object.keys(orderform).length < 1 ? 
                    <div>You have not downloaded any orderform. Please download one first.</div> :
                    Object.keys(table).length < 1 ? <div>Table not found</div> :
                    <div>
                        <div className={styles.table_info}>
                            <div>
                                <h3>{ table.tableNumber }&nbsp;&nbsp;#{ table.numParty }</h3>
                                <h3>arrived at { table.arrival }</h3>
                            </div>
                            <div className={styles.allergy_event_setting}>
                                <Modal btn_name='allergy' backgroundColor="crimson" color="white">
                                    <form onSubmit={updateAllergy} className={styles.allergy_chart}>
                                        <h3>Allergy Chart</h3>
                                        <div className={styles.allergy_container}>
                                            {
                                                orderform.allergy.map((a, i) => 
                                                    <div className={styles.allergy} key={i}>
                                                        <input id={a} type='checkbox' value={a} name={`allergy${i}`} defaultChecked={table.allergies.includes(a)}/>
                                                        <label htmlFor={a}>{ a }</label>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <button>update</button>
                                    </form>
                                </Modal>
                                <Modal btn_name='occasion'>
                                    <form onSubmit={updateEvent} className={styles.event_setting}>
                                        <h3>Occasion</h3>
                                        <div>
                                            <label>Occasion: </label>
                                            <input onChange={e => setEvent(e.target.value)} type='text' value={event}/>
                                        </div>
                                        <button>update</button>
                                    </form>
                                </Modal>
                            </div>
                        </div>
                        <br/>
                        <br/>
                      
                        <br/>
                        <div className={styles.table_allergies}>
                            {
                                table.event ?  <h3>{ table.event }</h3> : <h3>no special occasion</h3>
                            }
                            <hr/>
                            <h3>
                                {   
                                    table.allergies.length > 0 ?
                                    table.allergies.map((allergy, i) => <span key={i}>{ i > 0 ? `, ${allergy}` : allergy }</span>) :
                                    <span>no allergy</span>
                                }
                            </h3>
                        </div>
                        <br/>
                        <br/>
                        <div className={styles.orderpad}>
                            <div className={styles.category_container_wrapper}>
                                <div className={styles.category_container}>
                                    {
                                        orderform.category.map((category, i) => 
                                            <button 
                                                className={styles.category}
                                                style={{ 
                                                    backgroundColor: category === selectedCategory ? 'black' : 'transparent',
                                                    color:  category === selectedCategory ? 'white' : 'black'
                                                }}
                                                onClick={() => setSelectedCategory(category)} 
                                                key={i}>
                                                { category }
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                            <br/>
                            <div className={styles.item_container_wrapper}>
                                {
                                    selectedCategory && 
                                    <div className={styles.item_container}>
                                        {
                                            orderform.item.map((item, i) => item.category === selectedCategory &&
                                            <div key={i} className={styles.item}>
                                                {
                                                    item.options.length > 0 ? 
                                                    <Modal btn_name={item.name} backgroundColor={item.color || '#f1f1f1'}>
                                                        <form onSubmit={e => addItemWithOptions(e, item)} className={styles.option_container}>
                                                            <h4>Options</h4>
                                                            <div className={styles.options}>
                                                                {
                                                                    item.options.map((option, j) => 
                                                                    <div key={j} className={styles.option}>
                                                                        <input id={`option${i}-${j}`} type='checkbox' value={option.name} name={`option${j}`}/>
                                                                        <label htmlFor={`option${i}-${j}`}>{ option.name }</label>
                                                                    </div>)
                                                                }
                                                            </div>
                                                            <button className="confirm_btn">add</button>
                                                        </form>
                                                    </Modal> :
                                                    <button style={{ backgroundColor: item.color }} onClick={() => addItem(item)}>
                                                        { item.name }<span style={{ color: 'red' }}>{ allergyCheck(item.allergies) }</span>
                                                    </button>
                                                }
                                            </div>
                                            )
                                        }
                                    </div>  
                                }
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            {
                                currOrder.length > 0 &&
                                <div className={styles.curr_order}>
                                    <button onClick={() => setCurrOrder([...orderform.item.map(item => ({...item, quantity: 0, delivered: false}))])} className={styles.reset_btn}>reset</button>
                                    <h3>New Order</h3>
                                    <br/>
                                    {
                                        currOrder.map((item, i) => item.quantity > 0 &&
                                            <div className={styles.added_item} key={i}>
                                                <button onClick={() => removeItem(item)} className={styles.remove_item_btn}>X</button>
                                                <p>{ item.name } X { item.quantity }</p>
                                                <div>
                                                    <button onClick={() => decreaseItem(item)}>-</button>
                                                    <span>&nbsp;</span>
                                                    <button onClick={() => increaseItem(item)}>+</button>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <br/>
                                    <br/>
                                    <button onClick={placeOrder} className={styles.place_order_btn}>place order</button>
                                </div> 
                            }
                            <br/>
                            <br/>
                            <h2>Order History</h2>
                            <br/>
                            {   
                                table.orders.length < 1 ? 
                                <p>
                                    No order&apos;s been placed.
                                </p> :
                                table.orders.map((order, i) => 
                                    <div key={i} className={styles.table_status}>
                                        {
                                            order.items.map((item, i) => <p style={{ textDecoration: item.delivered && 'line-through red' }} key={i}>{ item.name } X { item.quantity }</p>)
                                        }
                                        <br/>
                                        <p><i>{ order.updatedAt }</i></p>
                                    </div>
                                )   
                            }  
                        </div>
                    </div>
            }
        </ServerLayout>
    )
}