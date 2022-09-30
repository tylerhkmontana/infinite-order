import styles from './styles/modal.module.scss'
import { useState } from 'react'

export default function Modal({ children, btn_name, backgroundColor='white', color='black', borderRadius='5px', borderColor='black' }) {
    const [isToggled, setIsToggled] = useState(false)
    
    return(
        <>
            <div onSubmit={(e) => {
                e.preventDefault()
                setIsToggled(false)
            }} style={{ display: isToggled ? 'flex' : 'none' }} className={styles.modal_container}>
                <div className={styles.modal}>
                    <p onClick={() => setIsToggled(false)} className={styles.close_btn}>X</p>
                    {children}
                </div>
            </div> 
            <button className={styles.toggle_btn} style={{ backgroundColor, color, borderRadius, borderColor }} onClick={() => setIsToggled(true)}><strong>{ btn_name }</strong></button>
        </>
    )
}