import ServerLayout from "../../components/serverLayout"
import styles from '../../styles/UpdateTable.module.scss'
import Modal from "../../components/modal"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function UpdateTable() {
    const router = useRouter()
    const [table, setTable] = useState({})
    const [orderform, setOrderform] = useState({})
    const [selectedCategory, setSelectedCategory] = useState('')

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const { tableId } = router.query
            const tables = JSON.parse(window.localStorage.getItem('tables')) || {}
            const orderform = JSON.parse(window.localStorage.getItem('orderform')) || {}
    
            setOrderform(orderform)
            setTable({...tables[tableId]})
        }
    }, [router.isReady])

    function addItem(item) {
        console.log(item)
    }

    function addItemWithOptions(item) {
        console.log('item with options')
    }
    
    return (
        <ServerLayout>
            {
                Object.keys(table).length < 1 ? <div>Table not found</div> :
                <div>
                    <h2>{ table.tableNumber }&nbsp;&nbsp;#{ table.numParty }</h2>
                    <h2>Arrived at { table.arrival }</h2>
                    <br/>

                    <div className={styles.orderpad}>
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
                        <br/>
                        <br/>
                        <div className={styles.item_container}>
                            {
                                selectedCategory && 
                                orderform.item.map((item, i) => item.category === selectedCategory &&
                                    <div className={styles.item}>
                                        {
                                            item.options.length > 0 ? 
                                            <Modal btn_name={item.name}>
                                                <form onSubmit={addItemWithOptions} className={styles.option_container}>
                                                    <h4>Options</h4>
                                                    <div className={styles.options}>
                                                        {
                                                            item.options.map((option, i) => 
                                                            <div key={i} className={styles.option}>
                                                                <input type='checkbox' value={option.name}/>
                                                                <label>{ option.name }(+${ option.charge })</label>
                                                            </div>)
                                                        }
                                                    </div>
                                                    <button className="confirm_btn">confirm</button>
                                                </form>
                                            </Modal> :
                                            <button 
                                                onClick={() => addItem(item)} 
                                                key={i}>
                                                { item.name }
                                            </button>
                                        }
                                    </div>
                                )
                            }
                        </div>               
                    </div>
                </div>
            }
        </ServerLayout>
    )
}