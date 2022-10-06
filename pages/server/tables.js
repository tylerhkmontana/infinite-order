import styles from '../../styles/Tables.module.scss'
import { useState, useEffect } from 'react'
import Modal from '../../components/modal'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ServerLayout from '../../components/serverLayout'
import secToTime from '../../modules/secToTime'
import { v4 as uuid4 } from 'uuid'

export default function Tables() {
    const router = useRouter()
    const [tables, setTables] = useState({})
    const [newTable, setNewTable ] = useState({
        tableNumber: '',
        numParty: 0,
    })

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const tables = JSON.parse(window.localStorage.getItem('tables')) || []
    
            setTables(tables)
        }
    }, [])

    function assignTableNumber(e) {
        const tableNumber = e.target.value
        setNewTable(prev => ({
            ...prev,
            tableNumber
        }))
    } 

    function assignNumParty(e) {
        const numParty = Number(e.target.value)
        setNewTable(prev => ({
            ...prev,
            numParty
        }))
    }

    function createNewTable(e) {
        e.preventDefault()
        const arrival = secToTime(new Date())
        const tableId = uuid4()
        const orders = []
        const allergies = []
        const event = ''

        const createdTable = {
            ...newTable,
            tableId,
            arrival,
            orders,
            allergies,
            event
        }

        if(typeof window !== 'undefined') {
            let currTables = JSON.parse(window.localStorage.getItem('tables')) || {}
            currTables[tableId] = {
                ...createdTable
            }

            window.localStorage.setItem('tables', JSON.stringify(currTables))

            setNewTable({
                tableNumber: '',
                numParty: 0,
            })
            setTables({...currTables})
        }
    }

    function clearTables() {
        if(typeof window !== 'undefined') {
            window.localStorage.removeItem('tables')
            setTables([])
        }
    }

    function removeTable(tableId) {
        if(typeof window !== 'undefined') {
            let tables = JSON.parse(window.localStorage.getItem('tables'))
            
           delete tables[tableId]
            
            window.localStorage.setItem('tables', JSON.stringify(tables))
            setTables({...tables})
        }
    }

    function updateOrderStatus(tableId, orderIndex, targetItem) {
        if(typeof window !== 'undefined') {
            let tables = JSON.parse(window.localStorage.getItem('tables'))
            let currTable = {...tables[tableId]}
            currTable.orders[orderIndex].items = currTable.orders[orderIndex].items.map(item => 
                item.name === targetItem.name ? ({...item, delivered: !item.delivered}) : item
            )

            console.log(currTable.orders[orderIndex].items)

            tables[tableId] = currTable

            window.localStorage.setItem('tables', JSON.stringify(tables))
            setTables({...tables})
        }
    }

    return (
        <ServerLayout>
            <div className={styles.create_or_clear}>
                <Modal btn_name='Create Table'>
                    <form className={styles.create_new_table} onSubmit={createNewTable}>
                        <h2>Create New Table</h2>
                        <div>
                            <label>Table Numer: </label>
                            <input onChange={assignTableNumber} type='text' placeholder="table number" value={newTable.tableNumber} required/>
                            <br/>
                            <br/>
                            <label># of Party: </label>
                            <input onChange={assignNumParty} type='number' placeholder='# of party' value={newTable.numParty} required/>
                        </div>
                        <button>create</button>
                    </form>
                </Modal>
                <Modal btn_name='Clear Tables' color='white' backgroundColor='red'>
                    <form className={styles.clear_tables}>
                        <h3>Clear Tables</h3>
                        <p>All of your table informations will be deleted from your device storage. Do you really want to do this?</p>
                        <button onClick={clearTables}>confirm</button>
                    </form>
                </Modal>
            </div>
            
            <br/>
            <br/>
            <div className={styles.curr_tables}>
                <h2>Current Tables</h2>
                <br/>
                <br/>
                <div className={styles.table_container}>
                    {
                        Object.keys(tables).length < 1 ?
                            <p>You are not serving any table.</p> :
                            Object.keys(tables).map((tableId, i) => {
                            const table = tables[tableId]
                            return <div key={i} className={styles.table_wrapper}>
                                <Modal btn_name='status'>
                                    <div className={styles.table_status_container}>
                                        <h4>Table Status</h4>
                                        <br/>
                                        {
                                            table.event && <p>Event: { table.event }</p>
                                        }   
                                        {
                                            table.allergies.length > 0 && 
                                                <p>Allergies: { table.allergies.map((alg, i) => <span key={i}>{ i > 0 ? `, ${alg}` : alg }</span>) }</p>
                                        }
                                        {
                                            tables[tableId].orders.length < 1 ? 
                                            <p>
                                                No order&apos;s been placed.
                                            </p> :
                                            tables[tableId].orders.map((order, orderIndex) => 
                                                <div key={orderIndex} className={styles.table_status}>
                                                
                                                    {
                                                        order.items.map((item, i) => 
                                                            <div key={i} className={styles.order_status}>
                                                                <p style={{ 
                                                                    textDecoration: item.delivered && 'line-through red'
                                                                 }}>{ item.name } X { item.quantity }</p>
                                                                <button style={{
                                                                    backgroundColor: item.delivered && 'green',
                                                                    color: item.delivered && 'white'
                                                                }} onClick={() => updateOrderStatus(tableId, orderIndex, item)}>
                                                                    {
                                                                        item.delivered ? 'delivered!' : 'waiting...'
                                                                    }   
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                    <br/>
                                                    <p><i>placed at { order.updatedAt }</i></p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </Modal>     

                                <Link href={`/server/updateTable?tableId=${table.tableId}`}>
                                    <div className={styles.table}>
                                        <span className={styles.table_number}>{ table.tableNumber }</span>
                                        <span className={styles.num_party}>#{ table.numParty }</span>
                                        <span className={styles.arrival}>{ table.arrival }</span>
                                    </div>
                                </Link>

                                <Modal btn_name='delete' color='white' backgroundColor='red'>
                                    <form onSubmit={() => removeTable(tableId)} className={styles.remove_table}>
                                        <h3>Remove the table</h3>
                                        <p>Do you really want to remove this table?</p>
                                        <button>confirm</button>
                                    </form>
                                </Modal>
                            </div>
                            })
                    }
                </div>
            </div>
        </ServerLayout>
    )
}
