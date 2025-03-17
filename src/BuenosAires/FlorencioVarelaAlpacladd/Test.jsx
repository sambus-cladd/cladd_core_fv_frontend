import React from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import PDFMuestraLab from './components/DocRolloMuestraLaboratorioPDF'
const Test = ({ rutina, Rollo, motivo, metrosTotal, tarima, articuloTerminado, ordenTrabajo, QrcodeImageUrl, anidarRutina, subLote, anotaciones, informeResultado, muestra, reImpresion=false }) => {

  return (
    <>
      <PDFViewer style={{ width: '100%', height: '1000px' }}>
        <PDFMuestraLab rutina={rutina}
          Rollo={Rollo} motivo={motivo} metrosTotal={metrosTotal}
          anidarRutina={anidarRutina} subLote={subLote}
          ordenTrabajo={ordenTrabajo}
          articuloTerminado={articuloTerminado}
          tarima={tarima}
          informeResultado={informeResultado}
          anotaciones={anotaciones}
          muestra={muestra}
          QrcodeImageUrl={QrcodeImageUrl}
          reImpresion={reImpresion}
        />
      </PDFViewer>
    </>
  )
}

export default Test