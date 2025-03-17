
import React from 'react'
import { Navbar } from '../../components'
import routes from './routesSanMartin'
import LogoCladd from '../../assets/Images/claddLogo.png'

function CladdSanMartin() {
  return (
    <div>
          <Navbar Titulo="CLADD SAN MARTIN"  Routes={routes} plantaLogo={LogoCladd} />
       
    </div>
  )
}

export default CladdSanMartin