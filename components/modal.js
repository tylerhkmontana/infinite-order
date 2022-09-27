import styles from './styles/modal.module.scss'
import { useState } from 'react'

export default function Modal({ children, btn_name, color }) {
    const [isToggled, setIsToggled] = useState(false)
    return(
        <>
            <div style={{ display: isToggled ? 'flex' : 'none' }} className={styles.modal_container}>
                <div className={styles.modal}>
                    <p onClick={() => setIsToggled(false)} className={styles.close_btn}>X</p>
                    {children}
                </div>
            </div> 
            <button className={styles.toggle_btn} style={{ borderColor: color, color: color }} onClick={() => setIsToggled(true)}>{ btn_name }</button>
        </>
    )
}