import react from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Image } from '@react-pdf/renderer';
import TimnaLogo from '../../../../assets/Images/TimnaLogo.png'
import { Font } from '@react-pdf/renderer';

const fontPath = 'src/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/Fonts';

Font.register({
  family: 'Axiforma',
  src: require('../Fonts/Axiforma-Medium.ttf')
});

// Bison
Font.register({
  family: 'Bison',
  src: require('../Fonts/Bison-Bold(PersonalUse).ttf')
});

// Avenir Next Condensed
Font.register({
  family: 'AvenirNextCondensed',
  src: require('../Fonts/Avenir Next Condensed.ttc')
});

//Axiforma Medium
Font.register({
  family: 'AxiformaMedium',
  src: require('../Fonts/Axiforma-Medium.ttf')
});

//Axiforma Medium italic
Font.register({
  family: 'AxiformaMedium',
  src: require('../Fonts/Axiforma-MediumItalic.ttf')
});

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 230,
    height: 130,
    marginLeft: 20
  },
  barcodeBlock: {
    alignItems: 'center',
    marginRight: 20,
    marginTop: 55,
  },
  barcodeImage: {
    width: 160,
    height: 50,
  },
  barcodeValue: {
    fontFamily: 'AxiformaMedium',
    fontSize: 14,
    marginTop: 5,
  },
  mainInfo: {
    flexDirection: 'row',
  },
  articulo: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Bison',
    marginRight: 80,
  },
  nombre: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    paddingVertical: 4,
    marginBottom: 5,
    width: 550,
    alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  cellLabel: {
    width: '10%',
    fontWeight: 'bold',
    fontFamily: 'AvenirNextCondensed',
    fontSize: 8,
  },
  cellValue: {
    width: '25%',
    fontFamily: 'Bison',
    fontSize: 20,
  },
  separador: {
    borderBottom: '1pt solid black',
    marginTop: 5,
    marginBottom: 5,
  },
  footer: {
    textAlign: 'center',
    fontSize: 9,
    marginTop: 8,
    borderTop: '1pt solid black',
    paddingTop: 4,
  },
});

const EtiquetaReimpresionPDF = ({ piezas }) => {
  return (
    <Document>
      {piezas.map((pieza, index) => (
        <Page key={index} size="LETTER" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.topRow}>
              {String(pieza.COD_CALIDAD) === '2' ? (
                <Text style={{ fontFamily: 'Bison', 
                  fontSize: 50, 
                  marginLeft: 20,
                }}>02 SEGUNDA</Text>
              ) : (
                <Image style={styles.logo} src={TimnaLogo} />
              )}
              <View style={styles.barcodeBlock}>
                <Image
                  style={styles.barcodeImage}
                  src={`http://192.168.40.95:4202/codigodebarratenido/${pieza.ROLLOS}`}
                />
                <Text style={styles.barcodeValue}>{pieza.ROLLOS?.toString().replace(/^0+/, '')}</Text>
              </View>
            </View>

            <View style={styles.table}>
              {/* Articulo y descripcion */}
              <View><Text style={styles.cellLabel}>ARTICULO</Text></View>
              <View style={styles.mainInfo}>
                <Text style={styles.articulo}>{pieza.PRODUCTO_ARTCOD_DEST}</Text>
                <Text style={styles.articulo}>{pieza.PROD_DESIMP}</Text>
              </View>

              <View style={styles.separador} />

              {/* Tabla de datos */}
              <View style={styles.row}>
                <Text style={styles.cellLabel}>LINEA</Text>
                <Text style={styles.cellValue}>{pieza.LINEA || '-'}</Text>
                <Text style={styles.cellLabel}>COLOR {pieza.COLOR || '-'}</Text>
                <Text style={styles.cellValue}>{pieza.PRODUCTO_PROCESO || '-'}</Text>
                <Text style={styles.cellLabel}>ANCHO STD</Text>
                <Text style={styles.cellValue}>{pieza.ANCHOSTD || '-'}</Text>
                <Text style={styles.cellLabel}>PUNTOS 100 / M2</Text>
                <Text style={styles.cellValue}>{pieza.PUNTOS}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.row}>
                <Text style={styles.cellLabel}>METROS</Text>
                <Text style={styles.cellValue}>{Math.round(pieza.METROS)}</Text>
                <Text style={styles.cellLabel}>CALIDAD</Text>
                <Text style={styles.cellValue}>
                  {pieza.COD_CALIDAD === 1 ? 'PRIMERA' : pieza.COD_CALIDAD}
                </Text>
                <Text style={styles.cellLabel}>PESO NETO</Text>
                <Text style={styles.cellValue}>{pieza.PESO_NETO || '-'}</Text>
                <Text style={styles.cellLabel}>PESO BRUTO</Text>
                <Text style={styles.cellValue}>{pieza.PESO_BRUTO || '-'}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.row}>
                <Text style={styles.cellLabel}>CODIGO INTERNO</Text>
                <Text style={styles.cellValue}>{pieza.RO_ARTIC || '-'}</Text>
                <Text style={styles.cellLabel}>LOTE</Text>
                <Text style={styles.cellValue}>{pieza.LOTE}</Text>
                <Text style={styles.cellLabel}>TONO</Text>
                <Text style={styles.cellValue}>{ }</Text>
                <Text style={styles.cellLabel}>MOTIVO FALLA</Text>
                <Text style={styles.cellValue}>{pieza.COD_FALLA}</Text>
              </View>

              <Text style={styles.footer}>{pieza.COMPOSICION}</Text>

            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default EtiquetaReimpresionPDF;
