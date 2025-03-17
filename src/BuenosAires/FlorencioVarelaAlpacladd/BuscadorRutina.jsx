import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Typography, Stack, Box, Grid } from '@mui/material';
import { useAuth } from '../../AuthContext';
import { getReporteLaboratorio } from './API/APIFunctions';
function BuscadorRutina({ handleTabChange }) {
    const {  auth } = useAuth();
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        getData();
    }, []);
    
    function QuickSearchToolbar() {
        return (
            <Box
                sx={{
                    p: 0.5,
                    pb: 0,
                }}
            >
                <GridToolbarQuickFilter />
            </Box>
        );
    }

    async function getData() {
        try {

            let respuesta = await getReporteLaboratorio();
            const formattedData = respuesta.data.map((item) => ({
                ...item,
                fecha: new Date(item.fecha).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }),
            }));
    
            setRows(formattedData);
            setFilteredRows(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data. Please try again later.");
        }
    }
    

    const handleFilter = (status) => {
        setStatusFilter(status);
        if (status === "") {
            setFilteredRows(rows);
        } else {
            setFilteredRows(rows.filter(row => row.status === status));
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'rutina',
            headerName: 'Rutina',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Button onClick={() => handleTabChange(null, "FormularioRegistro", params.row.rutina)} endIcon={<SearchIcon sx={{ color: '#000000' }} />}>
                    <Typography color="black" fontFamily="Poppins" fontWeight='bold'>
                        {params.row.rutina}
                    </Typography>
                </Button>
            )
        },
        { field: 'tarima', headerName: 'Tarima', flex: 0.8, headerClassName: 'super-app-theme--header' },
        { field: 'articulo_inicial', headerName: 'Artículo', flex: 0.8, headerClassName: 'super-app-theme--header' },
        { field: 'lote', headerName: 'Lote', flex: 1, headerClassName: 'super-app-theme--header' },
        { field: 'letra', headerName: 'Letra', flex: 0.5, headerClassName: 'super-app-theme--header' },

        {
            field: 'status',
            headerName: 'Estado',
            flex: 1,
            valueGetter: (params) => `${params.row.status || ''} ${params.row.resultado || ''}`,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography sx={{ color: params.row.status === "Finalizado" && params.row.resultado !== "CONFORME" ? "red" : 'black', fontFamily :"Poppins", fontWeight:'bold'}}>
                    {params.row.status === "Finalizado" ? params.row.resultado : params.row.status}
                </Typography>
            ),
        },
        { field: 'articulo_final', headerName: 'ArtículoFin', flex: 0.8, headerClassName: 'super-app-theme--header' },
        { field: 'corte', headerName: 'Corte', flex: 0.7, headerClassName: 'super-app-theme--header' },

        { field: 'metros', headerName: 'Metros', flex: 0.7, headerClassName: 'super-app-theme--header' },
        { field: 'fecha', headerName: 'Fecha', flex: 1, headerClassName: 'super-app-theme--header' },
        { field: 'motivo', headerName: 'Motivo', flex: 1, headerClassName: 'super-app-theme--header' },
    ];

    return (
        <>
        
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mb={2}>
                <Button variant="outlined" onClick={() => handleFilter("")}>Todos</Button>
                <Button variant='outlined' onClick={() => handleFilter("Entrada")}>Entrada</Button>
                <Button variant="outlined" onClick={() => handleFilter("Ingreso")}>Ingreso</Button>
                <Button variant="outlined" onClick={() => handleFilter("Marcado")}>Marcado</Button>
                <Button variant="outlined" onClick={() => handleFilter("Lavado")}>Lavado</Button>
                <Button variant="outlined" onClick={() => handleFilter("Reposo")}>Reposo</Button>
                <Button variant="outlined" onClick={() => handleFilter("Medicion")}>Medición</Button>
                <Button variant="outlined" onClick={() => handleFilter("Finalizado")}>Finalizado</Button>
            </Stack>
            <div style={{ width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    slots={{ toolbar: QuickSearchToolbar }}
                    autoHeight
                    initialState={{
                        columns: {
                            columnVisibilityModel: { id: false },
                        },
                        pagination: { 
                            paginationModel: { pageSize: 25 } }
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    sx={{
                        boxShadow: 2,
                        border: 2,
                        fontFamily: "Poppins",
                        fontSize: 14,
                        fontWeight: 600,
                        margin: "0rem",
                        backgroundColor: "#f4f4f4",
                        '& .super-app-theme--header': {
                            backgroundColor: '#0D3F5E',
                            color: 'white',
                            fontFamily: 'Poppins',
                            fontSize: 16,
                            fontWeight: 700,
                        },
                    }}
                />
            </div>
        </>
    );
}

export default BuscadorRutina;

