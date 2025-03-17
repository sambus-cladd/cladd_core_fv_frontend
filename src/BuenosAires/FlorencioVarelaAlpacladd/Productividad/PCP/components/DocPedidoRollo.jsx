import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import AlpaLogo from '../assets/Images/2alpaLogo.png';

// Definir estilos
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        position: 'relative',  // Necesario para usar absolute en el footer
    },
    headerContainer: {
        flexDirection: 'row',   // Organiza el logo y el título en una fila
        justifyContent: 'center',  // Distribuye los elementos en los extremos
        alignItems: 'center',   // Alinea los elementos verticalmente
        marginBottom: 10,       // Espacio debajo del header
    },
    logo: {
        width: 100,   // Ajusta el tamaño del logo
        height: 'auto',
    },
    headerTitle: {
        fontSize: 16,
        textAlign: 'center',  // Alinea el texto del título a la derecha
    },
    table: {
        display: "table",
        width: "auto",
        marginBottom: 20, // Espacio entre la tabla y cualquier cosa debajo de ella
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#f2f2f2",
        textAlign: 'center',
        padding: 4,
    },
    tableCol: {
        width: "33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        textAlign: 'center',
        padding: 4,
    },
    footer: {
        position: 'absolute',  // Absoluto respecto a la página
        bottom: 20,            // Distancia del pie de página respecto al borde inferior
        left: 20,
        right: 20,
        fontSize: 10,
        textAlign: 'left',
    },
    Cabecera: {
        padding: 0.25,
        margin: 0.25,
    },
    Cuerpo:
    {
        padding: 0.5,
        marginTop: 2,
    },
});


// Importar la fuente
Font.register({
    family: 'Open Sans',
    src: 'https://fonts.gstatic.com/s/opensans/v23/mem5YaGs126MiZpBA-UN8rsOUuhs.ttf',
});

// Componente del documento
const MyDocument = ({ orden, maquina, articulo, rollos }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Cabecera con logo a la izquierda y título a la derecha */}
            <View style={styles.Cabecera}>
                <Image style={styles.logo} src={AlpaLogo} />
            </View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Orden {orden} | Máquina {maquina} | Articulo {articulo}</Text>
            </View>

            {/* Tabla de datos justo debajo de la cabecera */}
            <View style={styles.table}>
                {/* Encabezados */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableColHeader}>Rollo</Text>
                    <Text style={styles.tableColHeader}>Ubicación</Text>
                    <Text style={styles.tableColHeader}>Fecha ingreso Varela</Text>
                </View>

                {/* Filas de datos */}
                {rollos.map((row, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCol}>{row.rollo}</Text>
                        {row.destino && row.numero_rack ? <Text style={styles.tableCol}>{`${row.destino} ${row.numero_rack}`}</Text> : <Text style={styles.tableCol}></Text>}
                        {row.fecha_registro ? <Text style={styles.tableCol}>{row.fecha_registro}</Text> : <Text style={styles.tableCol}></Text>}
                    </View>
                ))}
            </View>
            <View style={styles.Cuerpo}>
                <Text> -----------------------------------</Text>
                <Text> Recibió </Text>
            </View>

            {/* Pie de página */}
            <View style={styles.footer}>
                <Text>CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización</Text>
            </View>

        </Page>
    </Document>
);

export default MyDocument;
