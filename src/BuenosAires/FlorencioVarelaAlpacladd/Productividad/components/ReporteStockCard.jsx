import { React } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import DescargarExcel from './DescargarExcel';

export default function ReporteStockCard({ DataCard, TotalStock, DataTabla, denim, crudo, metrosDenim, metrosCrudo }) {
    let totalMetrosArticulo = 0;
    if (DataCard && DataCard.length > 0) {
        totalMetrosArticulo = DataCard.reduce((sum, item) => {
            return sum + parseFloat(item.Metros);
        }, 0);
    }

    
    return (
        <>
            <div style={{ overflowY: 'auto', height: '100vh' }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    sx={{
                        position: 'sticky',
                        top: 0,
                        width: '100%',
                        zIndex: 1000,

                    }}
                >
                    <h2 style={{ color: 'black', margin: 0, backgroundColor: 'white' }}>
                        Total de Rollos en Stock: <span style={{ color: '#008FFB', backgroundColor: 'white' }}>    {TotalStock} ({(totalMetrosArticulo / 1000).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km)
                        </span> | Crudo: <span style={{ color: '#008FFB', backgroundColor: 'white' }}> {crudo} ({(metrosCrudo / 1000).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km) </span>| Denim: <span style={{ color: '#008FFB', backgroundColor: 'white' }}>{denim} ({(metrosDenim / 1000).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km)</span>
                    </h2>
                    <DescargarExcel rows={DataTabla} nombreArchivo = "Stock de Rollos crudo"/>
                </Box>

                <Grid container spacing={1} columns={DataCard.length * DataCard.length} m={0.5} sx={{ boxSizing: 'content-box' }}>
                    {fArticulosSecciones(DataCard, DataTabla)}
                </Grid>
            </div>
        </>
    );
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { order, orderBy } = props;
    const headCells = [
        { id: 'Rollo', label: 'Rollo', numeric: true },
        { id: 'Orden', label: 'Orden', numeric: true },
        { id: 'Secuencia', label: 'Sec.', numeric: true },
        { id: 'Rack', label: 'Rack', numeric: true },
        { id: 'Largo', label: 'Km', numeric: true }
    ];


    return (
        <>
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'center' : 'center'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                            sx={{ bgcolor: 'rgba(50, 50, 50,0.5)' }}
                        >
                            <Typography fontSize={{ xs: 10, sm: 12, md: 12, lg: 12, xl: 12 }} sx={{ padding: '1px', color: 'white' }}>
                                {headCell.label}
                            </Typography>

                            <Typography fontWeight="bold" fontSize={{ xs: 12, sm: 12, md: 12, lg: 16, xl: 16 }} sx={{ padding: '1px', display: { xs: 'block', sm: 'none', md: 'none', lg: 'none', xl: 'none' } }}>
                                {headCell.labelCelular}
                            </Typography>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        </>
    );
}

function createData(id, Rollo, Orden, Secuencia, Rack, Metros, bgColor) {
    return {
        id,
        Rollo,
        Orden,
        Secuencia,
        Rack,
        Metros,
        bgColor,
    };
}

function TablaDatos(Filtro, FilasTabla, CantidadFilas) {
    const order = 'asc';
    const orderBy = 'Articulo';
    const page = 0;
    const rowsPerPage = (CantidadFilas);

    let rows = [];
    let fila;
    let bgcolor;

    if (FilasTabla !== null && FilasTabla !== undefined) {
        (FilasTabla).map((elemento, index) => {
            if (elemento.Articulo === Filtro) {
                // INICIO - Modificación Jose, perdon, Mariano 24-09-2024
                if (elemento.Articulo.charAt(0) !== 'Z' && elemento.Articulo.charAt(2) === '0') {
                    bgcolor = "rgba(255, 255, 255,0.2)";
                } else {
                    bgcolor = "rgba(12, 183, 242,0.2)";
                }
                // FIN - Modificación Jose, perdon, Mariano 24-09-2024         

                fila = createData(
                    index,
                    <Typography style={{ color: elemento.Estado === 'Stock' ? 'black' : 'red' }}>{elemento.Rollo}</Typography>, // Adjust field name
                    <Typography style={{ color: elemento.Estado === 'Stock' ? 'black' : 'red' }}>{elemento.OrdenLR}</Typography>, // Adjust field name
                    <Typography style={{ color: elemento.Estado === 'Stock' ? 'black' : 'red' }}>{elemento.Secuencia}</Typography>, // Adjust field name
                    <Typography style={{ color: elemento.Estado === 'Stock' ? 'black' : 'red' }}>{elemento.Rack}</Typography>, // Adjust field name
                    <Typography style={{ color: elemento.Estado === 'Stock' ? 'black' : 'red' }}>{(parseFloat(elemento.Metros / 1000)).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>, // Adjust field name and formatting
                    bgcolor
                );
                rows.push(fila);
            }
        });

    }

    return (
        <Paper elevation={3} sx={{ width: '100%', mb: 0, mt: 0.0 }}>
            <TableContainer sx={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <Table stickyHeader sx={{ width: '100%', borderRadius: '10%' }} size={"small"}>
                    <EnhancedTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow hover tabIndex={0} key={index}>
                                    <TableCell align="center" sx={{ backgroundColor: row.bgColor, padding: '0', width: "7rem" }}>{row.Rollo}</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: row.bgColor, padding: '0', width: "7rem" }}>{row.Orden}</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: row.bgColor, padding: '0', width: "7rem" }}>{row.Secuencia}</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: row.bgColor, padding: '0', width: "7rem" }}>{row.Rack}</TableCell>
                                    <TableCell align="center" sx={{ backgroundColor: row.bgColor, padding: '0', width: "7rem" }}>{row.Metros}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    );
}

function fArticulosSecciones(Data, DataTabla) {
    let nArticulos = Data.length;
    if (nArticulos > 0) {
        return <>
            {<Grid container spacing={1} columns={12}>
                {Data.map((ArticulosData, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        {CardArticulo(DataTabla, ArticulosData.Articulo, ArticulosData.Stock, ArticulosData.TotalRollos, (parseFloat(ArticulosData.Metros) / 1000))}
                    </Grid>
                ))}
            </Grid>

            }
        </>
    }
}

function CardArticulo(DataTabla, Articulo, Data, Cantidad, Metros) {
    return (
        <Grid container rowSpacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} md={10} lg={8}>
                <Grid container alignItems="center">
                    {/* Cantidad */}
                    <Grid item xs={3} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">{Cantidad}</Typography>
                        <Typography variant="body1" fontFamily='Poppins' fontStyle='italic'>Stock</Typography>
                    </Grid>

                    {/* Articulo */}
                    <Grid item xs={6} sx={{ textAlign: 'center', borderRight: "1px solid #ccc", borderLeft: "1px solid #ccc" }}>
                        <Typography variant="h4" sx={{ color: '#008FFB' }}>{Articulo}</Typography>
                        <Typography variant="body1" sx={{ color: '#008FFB' }} fontFamily='Poppins' fontStyle='italic'>Artículo</Typography>
                    </Grid>

                    {/* Metros */}
                    <Grid item xs={3} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">{(parseFloat(Metros)).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                        <Typography variant="body1" fontFamily='Poppins' fontStyle='italic'>km</Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* Tabla de datos */}
            <Grid item xs={12}>
                {TablaDatos(Articulo, DataTabla, Cantidad)}
            </Grid>
        </Grid>

    );
}