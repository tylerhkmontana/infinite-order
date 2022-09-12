import { readFile } from '../../modules/fileServices'
import styles from '../../styles/Orderform.module.scss'
import { useState } from 'react'

export default function Orderform({ menu, category }) {
    const [currMenu, setCurrMenu] = useState([])
    const [order, setOrder] = useState([])
    const [itemList, setItemList] = useState([])

    function menuHandler(category) {
        console.log(menu[category])
        setCurrMenu(prev => [...menu[category]])
    }

    function addItem(item) {
        const currItem = {...item}
        if (itemList.includes(currItem.name)) {
            const updatedOrder = order.map(o => o.name === currItem.name ? {...o, quantity: o.quantity + 1} : o)
            setOrder(prev => [...updatedOrder])

        } else {
            currItem.quantity = 0
            setItemList(prev => [...prev, currItem.name])
            setOrder(prev => [...prev, currItem])
        }
    }

    function decreaseItem(itemName) {
        const updatedOrder = order.map(item => {
            if(item.name === itemName) {
                let quantity = item.quantity
                if (quantity > 1) {
                    return  {
                        ...item,
                        quantity: quantity -1
                    }
                } else {
                    const updatedItemList = itemList.splice(itemList.indexOf(itemName))
                    setItemList(prev => [...updatedItemList])
                }
            } else {
                return item
            }
        })
        setOrder(prev => [...updatedOrder])
    }

    function removeItem(item) {

    }

    return (
        <div className={styles.container}>
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
                        order.map((item, i) => <div className={styles.order_item}>
                            <p key={i}>{ item.name } x { item.quantity }</p>
                            <button onClick={() => decreaseItem(item.name)}>-</button>
                            <button>remove</button>
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