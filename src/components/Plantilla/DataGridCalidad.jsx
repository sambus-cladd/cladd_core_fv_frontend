import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Button, Typography } from '@mui/material';
import { GridToolbarContainer, GridToolbarQuickFilter, DataGrid } from '@mui/x-data-grid';


const DataGridCalidad = ({ rows, columns }) => {

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(rows.map(row => {
            const newRow = { ...row };
            delete newRow.id; // Eliminar la columna "id" si existe en los datos
            delete newRow.color;
            return newRow;
        }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `Reporte en Excel.xlsx`);
    };
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Button variant="outlined" onClick={handleDownload}
                    startIcon={<SummarizeIcon />}
                    sx={{
                        border: '2px solid #01723a',
                        color: '#01723a',
                        marginLeft: '10px',
                        marginTop: '3px',
                        marginBottom: '3px',
                        '&:hover': {
                            borderColor: '#01723a',
                        },
                    }}
                >
                    Descargar Excel
                </Button>
                <GridToolbarQuickFilter />
                <Typography fontSize={16} fontFamily={'Poppins'} >
                    STOCK DE CALIDAD
                </Typography>
            </GridToolbarContainer>
        );
    }

    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowHeight={() => 'auto'}
                rowsPerPageOptions={[10,15, 25, 50, 100]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 15 }, 
                    },
                }}

                sx={{
                    boxShadow: 2,
                    border: 2,
                    fontFamily: "Poppins",
                    fontSize: 12,
                    fontWeight: 600,
                    margin: "0rem",
                    backgroundColor: "#f4f4f4",
                    '& .super-app-theme--header': {
                        backgroundColor: 'rgba(25, 118, 210,0.2)',
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        fontWeight: 700,
                    },
                }}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },

                }}
            />
        </>
    )
}

export default DataGridCalidad;