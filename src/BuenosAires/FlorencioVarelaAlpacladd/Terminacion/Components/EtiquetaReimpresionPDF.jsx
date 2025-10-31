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
    padding: 6,
    fontSize: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 110,
    marginLeft: 10,
  },
  barcodeBlock: {
    alignItems: 'center',
    marginRight: 10,
    marginTop: 30,
  },
  barcodeImage: {
    width: 170,
    height: 40,
  },
  barcodeValue: {
    fontFamily: 'Axiforma',
    fontSize: 14,
    marginTop: 5,
  },
  mainInfo: {
    flexDirection: 'row',
  },
  articulo: {
    fontSize: 25,
    fontFamily: 'Bison',
    marginRight: 60,
  },
  table: {
    paddingVertical: 4,
    marginBottom: 4,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  cellLabel: {
    width: '10%',
    fontFamily: 'AvenirNextCondensed',
    fontSize: 8,
    fontWeight: 'bold',
  },
  cellValue: {
    width: '15%',
    fontFamily: 'Bison',
    fontSize: 18,
  },
  separador: {
    borderBottom: '1pt solid black',
    marginVertical: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 8,
    marginTop: 6,
    borderTop: '1pt solid black',
    paddingTop: 3,
  },
});

const EtiquetaReimpresionPDF = ({ piezas }) => {
  return (
    <Document>
      {piezas.map((pieza, index) => (
        <Page
          key={index}
          size={{ width: 425.25, height: 283.5 }} // 15 cm × 10 cm horizontal
          style={styles.page}
        >
          <View>
            <View style={styles.topRow}>
              {String(pieza.COD_CALIDAD) === '2' ? (
                <Text style={{ fontFamily: 'Bison', fontSize: 50, marginLeft: 20 }}>
                  02 SEGUNDA
                </Text>
              ) : (
                <Image style={styles.logo} src={TimnaLogo} />
              )}
              <View style={styles.barcodeBlock}>
                <Image
                  style={styles.barcodeImage}
                  src={`http://192.168.40.95:4202/codigodebarratenido/${pieza.ROLLOS}`}
                />
                <Text style={styles.barcodeValue}>
                  {pieza.ROLLOS?.toString().replace(/^0+/, '')}
                </Text>
              </View>
            </View>

            <View style={styles.table}>
              <Text style={styles.cellLabel}>ARTICULO</Text>
              <View style={styles.mainInfo}>
                <Text style={styles.articulo}>{pieza.PRODUCTO_ARTCOD_DEST}</Text>
                <Text style={styles.articulo}>{pieza.PROD_DESIMP}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.row}>
                <Text style={styles.cellLabel}>LINEA</Text>
                <Text style={styles.cellValue}>{pieza.LINEA || '-'}</Text>
                <Text style={styles.cellLabel}>COLOR</Text>
                <Text style={styles.cellValue}>{pieza.COLOR || '-'}</Text>
                <Text style={styles.cellLabel}>ANCHO</Text>
                <Text style={styles.cellValue}>{pieza.ANCHOSTD || '-'}</Text>
                <Text style={styles.cellLabel}>PUNTOS</Text>
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
                <Text style={styles.cellLabel}>P. NETO</Text>
                <Text style={styles.cellValue}>{pieza.PESO_NETO || '-'}</Text>
                <Text style={styles.cellLabel}>P. BRUTO</Text>
                <Text style={styles.cellValue}>{pieza.PESO_BRUTO || '-'}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.row}>
                <Text style={styles.cellLabel}>COD INT</Text>
                <Text style={styles.cellValue}>{pieza.RO_ARTIC || '-'}</Text>
                <Text style={styles.cellLabel}>LOTE</Text>
                <Text style={styles.cellValue}>{pieza.LOTE}</Text>
                <Text style={styles.cellLabel}>TONO</Text>
                <Text style={styles.cellValue}>{pieza.TONO || '-'}</Text>
                <Text style={styles.cellLabel}>FALLA</Text>
                <Text style={styles.cellValue}>{pieza.COD_FALLA || '-'}</Text>
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
