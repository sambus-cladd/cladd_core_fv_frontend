import styles from "../css/MachineDatos.module.css";

// Última versión para GIT

export function MachineDatos({maquina})
{
        let msg; 
                    if(maquina.ESTADO === 0)  msg =<div className={styles.estadogris}><strong>Apagada</strong></div>;
                    else if(maquina.ESTADO === 1) msg =<div className={`${styles.estadorojo} ${styles.estadorojoflash}`}><strong>Sin Datos</strong></div>;
                    else if(maquina.ESTADO === 2) msg =<div className={styles.estado}><strong>Activa</strong></div>;
                    else if(maquina.ESTADO === 3) msg =<div className={`${styles.estadorojo} ${styles.estadorojoflash}`}><strong>Error</strong></div>;
                    else if(maquina.ESTADO === 4) msg =<div className={styles.estadogris}><strong>Virtual</strong></div>;
                    else if(maquina.ESTADO === 5) msg =<div className={`${styles.estadoverde} ${styles.estadoverdeflash}`}><strong>Fin de Ciclo</strong></div>;
                    else if(maquina.ESTADO === 6) msg =<div className={styles.estadocian}><strong>Manual</strong></div>;
                    else msg = <div className={`${styles.estadorojo} ${styles.estadorojoflash}`}><strong>Sin Datos</strong></div>;

                    // console.log(machine)
                    // console.log(machine.ESTADO, ": ",msg)
       
                    return (
                
        <li className={styles.machineDatos}>
                <div className={styles.backblanco}>
                    <div className={styles.backencabezado}><strong>{maquina.DESCRIPCION}</strong></div>
                    {msg}
                    <div><strong>Lote:</strong>&nbsp;{maquina.LOTE}</div>
                    {/* &nbsp;&nbsp;<strong>Peso:</strong>&nbsp;{maquina.PESO}&nbsp;&nbsp;<strong>Paso:</strong>&nbsp;{maquina.PASO} </div> */}
                    {/* <div> 
                    &nbsp;&nbsp;<strong>Ciclo:</strong>&nbsp;{maquina.CICLOPM}
                    </div> */}
                    {/* <div><strong>Receta:</strong>&nbsp;{maquina.IDRECETA}</div> */}
                    {/* <div><strong>Color:</strong>&nbsp;{maquina.COLORCITO}</div> */}
                    <div className={styles.maquinista}>{maquina.NOMBRE ? <strong>{maquina.NOMBRE}</strong> : <strong className={styles["sin-maquinista"]}>SIN MAQUINISTA ASIGNADO</strong>}</div>
                    <div className={styles.proxlote}>{maquina.PROXIDBARCADA ? <strong>Prox. Lote:&nbsp;{maquina.PROXIDBARCADA}</strong> : <strong>Prox. Lote:&nbsp;<strong className={styles["sin-lote"]}>SIN PROX. LOTE</strong></strong> }</div>
                </div> 
                    
         </li>     
         )
}
             