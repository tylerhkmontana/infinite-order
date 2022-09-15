import { readFile } from '../../../modules/fileServices'
import styles from '../../../styles/Orderform.module.scss'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ServerLayout from '../../../components/serverLayout'
import { v4 as uuid4 } from 'uuid'

export default function Orderform({ menu, category, filters }) {
    const router = useRouter()
    const [currMenu, setCurrMenu] = useState([])
    const [order, setOrder] = useState([])
    const [itemList, setItemList] = useState([])

    const [tableInfo, setTableInfo] = useState({
        tableNum: '',
        numParty: 0,
        filter: {}
    })

    useEffect(() => {
        // Setup inital table filter based on filter data
        let updatedFilter = {}
        Object.keys(filters).forEach(async filter => {
            updatedFilter = {
                ...updatedFilter,
                [filter]: []
            }
        })
        setTableInfo(prev => ({ ...prev, filter: updatedFilter }))
    }, [])

    function menuHandler(category) {
        setCurrMenu(prev => [...menu[category]])
    }

    async function addItem(item) {
        const currItem = {...item}
        if (itemList.includes(currItem.name)) {
            const updatedOrder = order.map(o => o.name === currItem.name ? {...o, quantity: o.quantity + 1} : o)
            setOrder(prev => [...updatedOrder])

        } else {
            currItem.quantity = 1
            setItemList(prev => [...prev, currItem.name])
            setOrder(prev => [...prev, currItem])
        }
    }

    function decreaseItem(itemName) {
        const updatedOrder = []
        order.forEach(item => {
            if(item.name === itemName) {
                let quantity = item.quantity
                if (quantity > 1) {
                    updatedOrder.push({
                        ...item,
                        quantity: quantity -1
                    })
                } else {
                    const updatedItemList = itemList.filter(item => item !== itemName)
                    setItemList(prev => [...updatedItemList])
                }
            } else {
                updatedOrder.push(item)
            }
        })
        setOrder(prev => [...updatedOrder])
    }

    function removeItem(itemName) {
        const updatedOrder = order.filter(item => item.name !== itemName)
        const updatedItemList = itemList.filter(item => item !== itemName)

        setItemList(prev => [...updatedItemList])
        setOrder(prev => [...updatedOrder])
    }

    function updateFilter(keyword, filterType) {
        let filter = {...tableInfo.filter}
        filter[filterType].includes(keyword) ? filter[filterType].splice(filter[filterType].indexOf(keyword), 1) : filter[filterType].push(keyword)
    }

    function placeOrder(event) {
        event.preventDefault()

        if(typeof window !== 'undefined'){
            // Generate uniquely random id from uuid4
            const orderId = uuid4()
            // Get ongoing orders from local storage
            let currOrders = JSON.parse(window.localStorage.getItem('orders')) || {}
            // Table Info
            const { tableNum, numParty, filter } = tableInfo
            // Order placed time
            let time = new Date()
            let hours = time.getHours() === 12 ? 12 : time.getHours() % 12
            let minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
            let amOrPm = time.getHours()/12 >= 1 ? 'PM' : 'AM'
            currOrders[orderId] = {
                name: tableNum,
                numParty: numParty,
                order: [...order],
                time: `${hours}:${minutes} ${amOrPm}`
            }
            
            window.localStorage.setItem('orders', JSON.stringify(currOrders))
       }

       router.push('/server')
    }

    return (
        <ServerLayout>
            <button onClick={() => console.log(tableInfo.filter)}>Check tableInfo</button>
            <form className={styles.place_order} onSubmit={placeOrder}>
                <input onChange={(e) => setTableInfo(prev => ({...prev, tableNum: e.target.value}))} placeholder='table #' required/>
                <input onChange={(e) => setTableInfo(prev => ({...prev, numParty: e.target.value}))} placeholder='# of party' type='number' required/>
                <button type='submit'>Place Order</button>
            </form>
            <div className={styles.filter_container}>
                <h1>Filter</h1>
                {
                    Object.keys(filters).map((filter, i) =>
                    <div key={i} className={styles.filter}>
                        <h3>{ filter }</h3>
                        <div className={styles.keyword_container}>
                        {
                            filters[filter].keywords.map((f, i) => 
                                <div key={i}>
                                    <input onChange={e => updateFilter(e.target.value, filter)} id={f} type='checkbox' value={f}/>
                                    <label htmlFor={f}>{ f }</label>
                                </div>
                            )
                        }
                        </div>
                    </div>
                    )
                }
            </div>
            <div className={styles.category_container}>
                <h1>Cateogory</h1>
                <div className={styles.category}>
                    {
                        category.map((c, i) => <button key={i} onClick={() => menuHandler(c)}>{ c }</button>)
                    }
                </div>
            </div>
            <div className={styles.menu_container}>
                <h1>Menu</h1>
                <div className={styles.menu}>
                    {
                        currMenu.map((item, i) => {
                        console.log(item.filters)
                        return <button key={i} onClick={() => addItem(item)}>{ item.name }</button>
                    })
                    }
                </div>
            </div>
            <div className={styles.order_container}>
                <h1>Order</h1>
                <div className={styles.order}>
                    {
                        order.map((item, i) => <div key={i} className={styles.order_item}>
                            <p>{ item.name } x { item.quantity }</p>
                            <button onClick={() => decreaseItem(item.name)}>-</button>
                            <button onClick={() => removeItem(item.name)}>remove</button>
                            </div>)
                    }
                </div>
            </div>
        </ServerLayout>
    )
}

export async function getStaticProps() {
    const menu = JSON.parse(await readFile('/data/menu.json'))
    const category = JSON.parse(await readFile('/data/category.json'))
    const filters = JSON.parse(await readFile('/data/filter.json'))

    return {
      props: {
        menu,
        category,
        filters
      }
    }
  }