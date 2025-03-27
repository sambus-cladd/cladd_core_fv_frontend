import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// import AlpaLogo from '../../assets/Images/alpaLogo.png'
import AlpaLogo from '../../../../assets/Images/2alpaLogo.png'
// Importar la fuente
Font.register({
    family: 'Open Sans',
    src: 'https://fonts.gstatic.com/s/opensans/v23/mem5YaGs126MiZpBA-UN8rsOUuhs.ttf',
});

// Estilos

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#fff',
        paddingTop: 10,
        fontSize: 8,
        fontFamily: 'Open Sans',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 0.5,

    },
    logo: {
        marginTop: 2,
        width: "28%",
        height: "75%",
        marginLeft: -3,
    },
    logoSmall: {
        width: "20%",
        height: "75%",
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    table: {
        display: 'table',
        width: '99%',
        margin: 2,
        borderTopWidth: 1,
        borderTopColor: '#000',
        marginBottom: "-1%",
        marginTop: "1.5%"
    },
    tableLarge: {
        display: 'table',
        width: '99%',
        height: 60,
        margin: 2,
        // border: 1,
        borderTopColor: '#000',
        marginBottom: "-1%",
        marginTop: "1.5%"
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        height: 25,
        width: '100%',
    },
    tableRowSmall: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        height: 20,
        width: '100%',
    },
    tableColSborder: {
        flexDirection: 'row',
        height: 20,
        width: '100%',
    },
    tableCol: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#000',
        padding: 0.1,
        paddingTop: 2,
        width: '100%',
    },
    tableColSborder: {

        padding: 0.1,
        paddingTop: 2,
        width: '100%',
    },
    tableColLarge: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#000',
        padding: 0.1,
        paddingTop: 2,
        width: '100%',
        height: 280,
    },
    tableCode: {
        display: 'table',
        width: '99%',
        margin: 2,
        marginTop: 3,
        marginBottom: -1,

    },
    tableRowCode: {
        flexDirection: 'row',
        height: 25,
        width: '100%',
    },
    tableColCode: {
        padding: 0.1,
        paddingTop: 2,
        width: '100%',
        flexDirection: 'row',

        justifyContent: 'space-around',


    },
    tableColHeader: {
        // backgroundColor: '#d3e1e3',
        color: '#000',
        fontWeight: 'bold',
        padding: 3,
    },

    tableColHeader: {
        // backgroundColor: '#d3e1e3',
        color: '#000',
        fontWeight: 'bold',
        padding: 3,
    },
    tableColFooter: {
        fontWeight: 'bold',
        padding: 3,
    },
    tableColTotal: {
        fontWeight: 'bold',
        padding: 3,
        borderTopWidth: 1,
        borderColor: '#000',
    },

    section: {
        marginVertical: 0.5,
    },
    sectionData: {
        marginVertical: 0.5,
        marginRight: -3,
    },
    tableColHeaderText: {
        textAlign: 'center',
        fontSize: 8,
    },
    tableColText: {
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 100,

    },

    tableColTextIzq: {
        textAlign: 'left',
        fontSize: 9,
        fontWeight: 100,
        paddingLeft: 2,

    },
    Cabecera: {
        padding: 0.25,
        margin: 0.25,
    },
    Cuerpo:
    {
        padding: 0.5,
        marginTop: -1,
    },

    barcode: {
        width: '40%',
        marginLeft: 1,
        marginRight: 1,
        height: 30,
        marginTop: 1,
        marginBottom: 0.5,
    },
    signatureLine:
    {
        borderTopWidth: 1,
        borderStyle: 'dotted',
        borderColor: 'black',
        // marginTop: 5,
        // marginBottom: 10,
    },
    lineBreak: {
        borderBottomWidth: 1,
        borderColor: 'white',
        marginVertical: 10,
    },

    signaturesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },

    signatureCol: {
        flex: 1,
        alignItems: 'center',
    },

    signText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    QR: {
        height: 60,
        width: 60,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 0.5,
        marginBottom: 0.5,

    },
});

function DocRolloMuestraLaboratorioPDF(props) {   
    return (
        <Document>
            {/* PÁGINA 1 - PRODUCCIÓN */}
            <Page size="A6" orientation="landscape" style={styles.page}>
                {/* Cabecera */}
                <View style={styles.Cabecera}>
                    <View style={styles.header}>
                        <Image style={styles.logo} src={AlpaLogo} />
                        <View style={styles.sectionData}>
                            <Text style={styles.title}>Alpacladd La Rioja</Text>
                            <Text>Fecha:    </Text>
                            <Text>Sector: Revisado  </Text>
                            <Text>Operario: </Text>
                        </View>
                        {/* <View style={styles.QR}>
                            <Image src= />
                        </View> */}
                    </View>
                </View>
                <View style={styles.Cuerpo}>
                    {/* 1º Tabla: Orden-Secuencia-Articulo-Metros Totales-Ancho */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Rollo</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Secuencia</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Articulo </Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Trama</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Urdimbre</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Telar</Text>
                            </View>

                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>5555</Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>5</Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>AA000 </Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>12</Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>12</Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>25</Text>
                            </View>

                        </View>
                    </View>

                    {/* 2º Tabla: Telar-Trama-Urdimbre-ptos/100m²-  */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Metros Totales [m]</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Ancho [m]</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>Falla Principal</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>ptos/100m²</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>2555</Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>1.5</Text>
                            </View>
                            <View style={[styles.tableCol, styles.tableColHeader]}>
                                <Text style={[styles.tableColHeaderText]}>POLIPROPILENO</Text>
                            </View>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>5</Text>
                            </View>
                        </View>
                    </View>

                    {/* 3º Tabla: OBSERVACIONES */}
                    <View style={styles.tableLarge}>
                        <View style={styles.tableRowSmall}>
                            <View style={[styles.tableCol]}>
                                <Text style={[styles.tableColText]}>OBSERVACIONES</Text>
                            </View>
                        </View>
                        <View style={styles.tableRowSborder}>
                            <View style={[styles.tableColSborder]}>
                                <Text style={[styles.tableColText]}> </Text>

                            </View>
                        </View>

                    </View>
                </View>


            </Page>

        </Document>
    )
}

export default DocRolloMuestraLaboratorioPDF