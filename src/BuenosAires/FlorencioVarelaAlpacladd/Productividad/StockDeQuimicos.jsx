import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { InputAdornment } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AlpaLogo from '../../../assets/Images/alpaLogo.png';
import { Navbar } from '../../../components';
import { getStockQuimicos } from "../API/APIFunctions";
import dayjs from "dayjs";

const StockDeQuimicos = () => {
  const [dataStock, setDataStock] = useState(null);
  const dataStockExcel = dataStock?.map(({ id, codigo, quimico, cantidad }) => ({
    id,
    codigo,
    quimico,
    cantidad,
  }));

  const [search, setSearch] = useState("");

  const filteredData = dataStock?.filter((chemical) =>
    chemical.quimico.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const TablaStock = async () => {
      try {
        const response = await getStockQuimicos();
        if (JSON.stringify(response[0]) !== JSON.stringify(dataStock)) {
          setDataStock(response[0]);
          console.log("Stock actualizado");
        }
      } catch (error) {
        console.error("Error al obtener stock de químicos:", error);
      }
    };

    TablaStock();
    const interval = setInterval(TablaStock, 30000);
    return () => clearInterval(interval);
  }, [dataStock]);

  // 📌 Función para exportar a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataStockExcel); // Convierte el array de datos en hoja de Excel
    const wb = XLSX.utils.book_new(); // Crea un nuevo libro
    XLSX.utils.book_append_sheet(wb, ws, "Stock Químicos"); // Agrega la hoja al libro
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Obtener fecha y hora actual en formato YYYY-MM-DD_HH-mm-ss
    const fechaHora = dayjs().format("YYYY-MM-DD_HH-mm-ss");
    // Nombre del archivo con fecha y hora
    const fileName = `StockQuimicos_${fechaHora}.xlsx`;

    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, fileName); // Descarga el archivo
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Navbar Titulo="STOCK DE QUIMICOS" color={"alpacladd"} plantaLogo={AlpaLogo} />

      {/* Contenido principal */}
      <div style={{ flexGrow: 1, overflow: 'auto' }}>
        <TableContainer component={Paper} style={{ margin: "20px auto", width: "90%", maxHeight: "calc(100vh - 180px)", overflow: "auto" }}>

          {/* 🔎 Barra de búsqueda y botón de exportar */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
            <TextField
              // label="Buscar Químico"
              variant="outlined"
              placeholder="Buscar Químico"
              sx={{ width: "350px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" color="success" startIcon={<FileDownloadIcon />} onClick={exportToExcel}>
              Exportar a Excel
            </Button>
          </div>

          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#1A4862", color: "#ffffff", fontWeight: "bold", fontSize: 20 }}>Químico</TableCell>
                <TableCell align="center" style={{ backgroundColor: "#1A4862", color: "#ffffff", fontWeight: "bold", fontSize: 20 }}>Cantidad</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((chemical, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff" }}>
                    <TableCell sx={{ fontWeight: 500 }}>{chemical.quimico}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>
                      {chemical.cantidad} {chemical.unidad}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 600, fontSize: 18, color: "gray" }}>No disponible</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1A4862', padding: '5px', textAlign: 'center', color: 'white', fontSize: '15px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
      </footer>
    </div>
  );
};

export default StockDeQuimicos;