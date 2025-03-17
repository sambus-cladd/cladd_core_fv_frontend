import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const generarExcel = (rows, nombreArchivo) => {
    if (!Array.isArray(rows) || rows.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
        rows.map(row => {
            const newRow = { ...row };
            delete newRow.id; // Eliminar la columna "id" si existe en los datos
            return newRow;
        })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fecha = new Date();
    const fecha_hoy = (fecha.toLocaleString().slice(0, 9));
    const fileName = nombreArchivo.trim() ? nombreArchivo : 'Reporte';
    saveAs(data, `${fileName} ${fecha_hoy}.xlsx`);
};

const DescargarExcel = ({ rows, label, nombreArchivo }) => {
    return (
        <Button 
            variant='contained' 
            endIcon={<DownloadIcon />} 
            onClick={() => generarExcel(rows, nombreArchivo)}
            size='small'
        >
            {label ? label : 'Descargar Excel'}
        </Button>
    );
}

export default DescargarExcel;

