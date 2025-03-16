import styles from './notfound.module.css'



export function NotFound(){
    return(
        <div className={styles.container}>
            <h1 className={styles.notfound}>404 - Página não encontrada</h1>
        </div>
    )
}