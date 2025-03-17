import styles from "../css/footer.module.css"
import imagen from "../images/LOGOCLADD.png"

export function Footer(){
    return(
            
            <table align="Center">
                <tr>
                <th><img src={imagen} alt=""></img></th>
                <th><div className={styles.sombra} align="center"> © 2022 - Industria 4.0 - Alpacladd <br /> Todos los derechos reservados <br />(La Rioja - Argentina)</div></th>
                </tr>
            </table>
    )
}