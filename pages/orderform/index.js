import { readFile } from '../../modules/fileServices'
import styles from '../../styles/Orderform.module.scss'
import { useState } from 'react'

export default function Orderform({ menu, category }) {
    const [currMenu, setCurrMenu] = useState([])
    const [order, setOrder] = useState([])
    const [itemList, setItemList] = useState([])

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

        console.log(itemList)
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

    return (
        <div className={styles.container}>
            <button onClick={() => console.log(itemList)}>Check Item List</button>
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
                        currMenu.map((item, i) => <button key={i} onClick={() => addItem(item)}>{ item.name }</button>)
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
        </div>
    )
}

export async function getStaticProps() {
    const menu = JSON.parse(await readFile('/data/menu.json'))
    const category = JSON.parse(await readFile('/data/category.json'))

    return {
      props: {
        menu,
        category
      }
    }
  }