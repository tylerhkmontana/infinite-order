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
        const events = ''

        const createdTable = {
            ...newTable,
            tableId,
            arrival,
            orders,
            allergies,
            events
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
                <Modal btn_name='Clear Tables' color='crimson'>
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
                                <Link href={`/server/updateTable?tableId=${table.tableId}`}>
                                    <div className={styles.table}>
                                        <span className={styles.table_number}>{ table.tableNumber }</span>
                                        <span className={styles.num_party}>#{ table.numParty }</span>
                                        <span className={styles.arrival}>{ table.arrival }</span>
                                    </div>
                                </Link>

                                <Modal btn_name='status'>

                                </Modal>
                            </div>
                            })
                    }
                </div>
            </div>
        </ServerLayout>
    )
}
