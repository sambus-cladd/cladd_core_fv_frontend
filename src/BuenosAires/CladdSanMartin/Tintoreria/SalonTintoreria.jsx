import React from 'react';
import { MachineGrid } from "./components/MachineGrid";
import styles from "../../../BuenosAires/CladdSanMartin/Tintoreria/css/backtintoreria.css";
import { Navbar } from '../../../components';
import LogoCladd from '../../../assets/Images/claddLogo.png'
 
function SalonTintoreria() {
    return <div>
        
        <header>
                        
        </header>

        <div className='backgroundtinto' >
      
      {/* <Navbar Titulo="-- SALÓN TINTORERÍA --" plantaLogo={LogoCladd}/> */}

        <main>
    
           <MachineGrid />
           <br /><br />
        </main>
        
    </div>
    </div>
  }
  
  export default SalonTintoreria
 