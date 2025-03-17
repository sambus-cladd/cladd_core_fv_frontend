import styles from "../css/MachineGrid.module.css";
import { useEffect, useState } from "react";
import { MachineDatos } from "./MachineDatos";
import { getAPI } from "../functions/funciones";
import CladdLogo from '../../../../assets/Images/claddLogo.png'

export function MachineGrid(){

    const [Maquinas, setMaquinas] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState("");

    let identificadorIntervaloDeTiempo = 60000;
    let contador=0;
    let dataRaw;
    
    const GetData= async () => 
    {
        dataRaw = await getAPI( );
        setMaquinas(dataRaw);

        // Obtener la fecha y hora actual
        const dateTime = new Date().toLocaleString();
        setCurrentDateTime(dateTime);
    }

    useEffect(()=>{
        GetData();

        const interval = setInterval(() => 
            {
                console.log(contador)
                if(contador === 1) 
                    {                    
                        GetData();
                        contador=0;
                    }            
            
                    contador = contador+1;
            
            }, identificadorIntervaloDeTiempo);

        return () => clearInterval(interval);
    },[])

    return(
        <>
            <br />
            <ul className={styles.MachineGrid}> {Maquinas.map((maquina) =>(
                <MachineDatos key={maquina.MAQUINA} maquina={maquina}> </MachineDatos>   
            )  )}
            </ul>
            {/* Se agrega en la part de footer el logo de cladd y la fehc ay hora de actualización de la API */}
                {/* <img src={ CladdLogo } alt="logo" width="130" height = "65" style={{ textAlign: 'right', paddingRight: '20px', marginTop: '0px' }} /> */}
                <br />
                <h1 style={{ color: 'white', textAlign: 'right', paddingRight: '20px', marginTop: '-100px' }}>Salón Tintorería - San Martín</h1>
                <h4 style={{ color: '#c6b165', textAlign: 'right', paddingRight: '60px', marginTop: '-5px' }}>Fecha y Hora de Actualización: {currentDateTime} </h4>
            <br />
        </>
    );
    
}