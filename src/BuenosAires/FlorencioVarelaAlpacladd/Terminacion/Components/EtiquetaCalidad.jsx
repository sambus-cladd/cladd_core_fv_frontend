import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import AlpaLogo from '../../../../assets/Images/1claddLogo.png';
// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 5,
        fontSize: 10,
        paddingBottom: 30
    },
    sectionTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionBottom: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px dashed gray',
        alignItems: 'center',
    },
    entry: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        justifyContent: 'space-between',
    },
    text: {
        width: '25%',
    },
    barcode: {
        width: '40%',
        textAlign: 'center',
    },
    barcodeImage: {
        width: '70%',
        height: '30%'
    },
    qualityIndicator: {
        width: '15%',
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white',
        padding: 2,
    },
    logo: {
        width: '20%',
        marginTop: 10, // Add some space above the logo
        alignSelf: 'left',
        width: 50, // Set the logo width
        height: 50, // Set the logo height
    },
    footer: {
        width: '80%',
        marginTop: 10,
    },
    espacioEnBlanco: {
        width: '15%',
        textAlign: 'center',
        padding: 2,
    },
});


const BarcodeLabel = ({ lote, articulo, piezas, primera, cantidad, orden, posicion, hdr }) => (
    <Document>
        <Page size="A6" orientation='landscape' style={styles.page}>
            {/* Top Section */}
            <View style={styles.sectionTop}>
                <Text style={styles.text}>HOJA RUTA {hdr}</Text>
                <Text style={styles.text}>LOTE {lote}</Text>
                <Text style={styles.text}>ORDEN {orden}</Text>
                <Text style={styles.text}>ARTICULO {articulo}</Text>
                <Text style={styles.text}>POSICION {posicion}</Text>
                <Text style={styles.text}>PRIMERA  {primera}/{cantidad}</Text>
                <Text style={styles.text}>NO SON 1° {cantidad - primera}</Text>
            </View>

            {/* Bottom Section */}
            <View style={styles.sectionBottom}>
                <View>
                    {[...Array(Math.ceil(piezas.length / 2))].map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {/* Primer elemento en la fila */}
                            <View style={styles.entry}>
                                <Text style={styles.text}>{piezas[rowIndex * 2]?.codigo}</Text>
                                <View style={styles.barcode}>
                                    <Image
                                        style={styles.barcodeImage}
                                        src={`http://192.168.40.95:4202/codigodebarratenido/${piezas[rowIndex * 2]?.codigo}`}
                                    />
                                </View>
                                {piezas[rowIndex * 2]?.calidad === '2' ? (
                                    <Text style={styles.qualityIndicator}>{piezas[rowIndex * 2]?.calidad}</Text>
                                ) : <Text style={styles.espacioEnBlanco}>        </Text>}
                            </View>

                            {/* Segundo elemento en la fila, si existe */}
                            {piezas[rowIndex * 2 + 1] && (
                                <View style={styles.entry}>
                                    <Text style={styles.text}>{piezas[rowIndex * 2 + 1]?.codigo}</Text>
                                    <View style={styles.barcode}>
                                        <Image
                                            style={styles.barcodeImage}
                                            src={`http://192.168.40.95:4202/codigodebarratenido/${piezas[rowIndex * 2 + 1]?.codigo}`}
                                        />
                                    </View>
                                    {piezas[rowIndex * 2 + 1]?.calidad === '2' ? (
                                        <Text style={styles.qualityIndicator}>{piezas[rowIndex * 2 + 1]?.calidad}</Text>
                                    ) : <Text style={styles.espacioEnBlanco}>        </Text>}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <Image
                    style={styles.logo}
                    src={AlpaLogo}
                />
                <Text style={styles.text}>06/11/2024 00:00</Text>

            </View>
        </Page>
    </Document>
);

export default BarcodeLabel;
