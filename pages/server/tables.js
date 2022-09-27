import styles from '../../styles/Tables.module.scss'
import { useState, useEffect } from 'react'
import Modal from '../../components/modal'
import { useRouter } from 'next/router'
import ServerLayout from '../../components/serverLayout'
import { v4 as uuid4 } from 'uuid'

export default function Tables() {
    const [tables, setTables] = useState([])
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
        const updated = new Date()
        const tableId = uuid4()
        const orders = []

        const createdTable = {
            ...newTable,
            tableId,
            updated,
            orders
        }

        if(typeof window !== 'undefined') {
            let currTables = JSON.parse(window.localStorage.getItem('tables')) || []
            currTables.push(createdTable)

            window.localStorage.setItem('tables', JSON.stringify(currTables))

            setNewTable({
                tableNumber: '',
                numParty: 0,
            })
            setTables([...currTables])
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
            <form className={styles.create_new_table} onSubmit={createNewTable}>
                <h2>Create New Table</h2>
                <br/>
                <label>Table Numer: </label>
                <input onChange={assignTableNumber} type='text' placeholder="table number" value={tables.tableNumber} required/>
                <br/>
                <br/>
                <labe># of Party: </labe>
                <input onChange={assignNumParty} type='number' placeholder='# of party' value={tables.numParty} required/>
                <br/>
                <br/>
                <button>create</button>
            </form>
            <br/>
            <br/>
            <div className={styles.table_container}>
                <h2>Current Tables</h2>
                <br/>
                <br/>
                {
                    tables.length < 1 ?
                        <p>You are not serving any table.</p> :
                        tables.map((table, i) => 
                            <div key={i}>
                                { table.tableNumber }
                            </div>)
                }
                <br/>
                <br/>
                <button onClick={clearTables}>Clear Tables</button>
            </div>
        </ServerLayout>
    )
}
