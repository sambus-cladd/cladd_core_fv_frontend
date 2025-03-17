import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import AlpaLogo from '../../../../assets/Images/1claddLogo.png';

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 5,
        fontSize: 10,
        paddingBottom: 30,
    },
    sectionTop: {
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px dashed gray',
        marginBottom: 3,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 9, // Espacio entre la fila de títulos y la de valores
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        width: '14%',
        textAlign: 'center',
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    value: {
        fontSize: 10,
        width: '14%',
        textAlign: 'center',
    },
    sectionBottom: {
        flexDirection: 'column',
    },
    entry: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        justifyContent: 'space-between',
        border: '1px dashed gray',
    },
    barcode: {
        width: '40%',
        textAlign: 'center',
    },
    barcodeImage: {
        width: '70%',
        height: '30%',
    },
    qualityIndicator: {
        width: '15%',
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white',
        padding: 2,
    },
    logo: {
        width: 50,
        height: 50,
        marginTop: 10,
        alignSelf: 'left',
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

const EtiquetaCalidadLetter = ({ lote, articulo, piezas, primera, cantidad, orden, posicion, hdr, fecha }) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
            {/* Top Section */}
            <View style={styles.sectionTop}>
                {/* Fila de títulos */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>HOJA DE RUTA</Text>
                    <Text style={styles.title}>LOTE</Text>
                    <Text style={styles.title}>ORDEN</Text>
                    <Text style={styles.title}>ARTICULO</Text>
                    <Text style={styles.title}>POSICION</Text>
                    <Text style={styles.title}>PRIMERA</Text>
                    <Text style={styles.title}>NO SON 1°</Text>
                </View>
                {/* Fila de valores */}
                <View style={styles.valueRow}>
                    <Text style={styles.value}>{hdr}</Text>
                    <Text style={styles.value}>{lote}</Text>
                    <Text style={styles.value}>{orden}</Text>
                    <Text style={styles.value}>{articulo}</Text>
                    <Text style={styles.value}>{posicion}</Text>
                    <Text style={styles.value}>{primera}/{cantidad}</Text>
                    <Text style={styles.value}>{cantidad - primera}</Text>
                </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.sectionBottom}>
                <View>
                    {[...Array(Math.ceil(piezas.length / 2))].map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {/* Primer elemento en la fila */}
                            <View style={styles.entry}>
                                <Text style={styles.text}>{piezas[rowIndex * 2]?.ROLLOS}</Text>
                                <View style={styles.barcode}>
                                    <Image
                                        style={styles.barcodeImage}
                                        src={`http://192.168.40.95:4202/codigodebarratenido/${piezas[rowIndex * 2]?.ROLLOS}`}
                                    />
                                </View>
                                {piezas[rowIndex * 2]?.COD_CALIDAD !== 1 ? (
                                    <Text style={styles.qualityIndicator}>{piezas[rowIndex * 2]?.COD_CALIDAD}</Text>
                                ) : <Text style={styles.espacioEnBlanco}>        </Text>}
                            </View>

                            {/* Segundo elemento en la fila, si existe */}
                            {piezas[rowIndex * 2 + 1] && (
                                <View style={styles.entry}>
                                    <Text style={styles.text}>{piezas[rowIndex * 2 + 1]?.ROLLOS}</Text>
                                    <View style={styles.barcode}>
                                        <Image
                                            style={styles.barcodeImage}
                                            src={`http://192.168.40.95:4202/codigodebarratenido/${piezas[rowIndex * 2 + 1]?.ROLLOS}`}
                                        />
                                    </View>
                                    {piezas[rowIndex * 2 + 1]?.COD_CALIDAD !== 1 ? (
                                        <Text style={styles.qualityIndicator}>{piezas[rowIndex * 2 + 1]?.COD_CALIDAD}</Text>
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
                <Text style={styles.text}>{fecha}</Text>
            </View>
        </Page>
    </Document>
);

export default EtiquetaCalidadLetter;
