import React from 'react'
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter'
import Menu from '../../../components/Plantilla/Menu'
import { Navigate } from 'react-router-dom'
import FormStockPlanta from './FormStockPlanta'
import FormCalidadPlanta from './FormCalidadPlanta'
import routes from '../routesFValpa'
const StockPlanta = () => {

  const menu = [
    {label: "Home", icon: "", component: <Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" /> },
    {label: "Carga de calidad", icon: "", component: <FormCalidadPlanta /> },
    {label: "Carga de produccion", icon: "", component: <FormStockPlanta /> },
  ]
  return (
    <>
      <HeaderYFooter titulo="ALPACLADD" routes={routes} color="alpacladd">
        <Menu tabsConfig={menu} />
      </HeaderYFooter>
    </>
  )
}
export default StockPlanta