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
            const updatedList = order.map(o => o.name === currItem.name ? {...o, quantity: o.quantity + 1} : o)
            setOrder(prev => [...updatedList])

        } else {
            currItem.quantity = 0
            setItemList(prev => [...prev, currItem.name])
            setOrder(prev => [...prev, currItem])
        }
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
                        order.map((item, i) => <p key={i}>{ item.name } x { item.quantity }</p>)
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