import { useState, React } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, GridToolbar   } from '@mui/x-data-grid';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SummarizeIcon from '@mui/icons-material/Summarize';


export default function DataGridTable({ rows, columns, filename, HeadCellsBg, RowCellsBg }) {
  const [pageSize, setPageSize] = useState(13);

  const localizedTextsMap = {
    columnMenuUnsort: "Volver",
    columnMenuSortAsc: "Ordenar de Menor a Mayor",
    columnMenuSortDesc: "Ordenar de Mayor a Menor",
    columnMenuFilter: "Filtros",
    columnMenuHideColumn: "Ocultar",
    columnMenuShowColumns: "Mostrar Columnas",

  };

  //INICIO - exportar datos de la tabla DataGrid a Excel
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows.map(row => {
      const newRow = { ...row };
      delete newRow.id; // Eliminar la columna "id" si existe en los datos
      return newRow;
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Reporte en Excel ${filename}.xlsx`);
  };
  //FIN - exportar datos de la tabla DataGrid a Excel

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        {/* Agrego el boton para descargar y en el el evento onClic con la función de Exportar a Excel */}
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
        {/* <Button variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              sx={{
                border: '2px solid #b30b00',
                color: '#b30b00',
                marginLeft: '10px',
                marginTop: '3px',
                marginBottom: '3px',
                opacity: 0.5,
                '&:hover': {
                  borderColor: '#b30b00',
                },
              }}
      >
        Descargar PDF
      </Button> */}

      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: 400,
        width: '100%',

        '& .table-header': {
          backgroundColor: HeadCellsBg,
          fontFamily: "poppins",
          justifyContent: "center",
          fontSize: 15,
          textAlign: 'center'
        },
        '& .table-body': {
          backgroundColor: RowCellsBg,
          fontFamily: "poppins",
          justifyContent: "center",
          fontSize: 13,
          textAlign: 'center',
          headerAlign: 'center'
        },
      }}
    >
      <Paper sx={{ display: 'flex', flexGrow: 1, width: '100%', height: 401, mb: 3, bgcolor: 'rgba(25, 118, 210,0.05)' }}>
        <DataGrid
          flexGrow={1}
          rows={rows}
          columns={columns.map((column) => ({
            ...column,
            align: "center", // Agrega la propiedad align con el valor "center" a todas las columnas
            headerAlign: "center", // Alinea los encabezados al centro
          }))}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 13, 50, 100]}
          labelRowsPerPage=""
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          getRowHeight={() => 'auto'}
          disableSelectionOnClick
          localeText={localizedTextsMap}

          //Aquí se cargan los datos por API que van al DataGrid
          componentsProps={{
            toolbar: {
              filename: filename
            }
          }}
          slots={{ toolbar: CustomToolbar }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          ignoreDiacritics
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
