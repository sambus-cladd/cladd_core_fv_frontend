import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AlpaLogo from '../../../assets/Images/alpaLogo.png';
import { Navbar } from '../../../components';
import { getStockQuimicos } from "../API/APIFunctions";



const StockDeQuimicos = () => {

  const [dataStock, setDataStock] = useState([]);

  const containerStyle = {
    height: '100vh', // Ocupa toda la altura de la pantalla
    display: 'flex',
    flexDirection: 'column',
  };

  const contentStyle = {
    flexGrow: 1, // Permite que el contenido crezca y se adapte
    overflow: 'auto', // Habilita el scroll si es necesario
  };

  const footerStyle = {
    backgroundColor: '#1A4862',
    padding: '5px',
    textAlign: 'center',
    color: 'white',
    fontSize: '15px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };

  const tableContainerStyle = {
    margin: "20px auto",
    width: "90%",
    maxHeight: "calc(100vh - 180px)", // Ajusta la altura de la tabla dejando espacio para el header y el footer
    overflow: "auto",
  };

  useEffect (() => {
    const TablaStock = async () => {
      try {
        const response = await getStockQuimicos();
        console.log("respuesta",response);
        setDataStock(response[0]);
      } catch (error){
        console.error( "Error al obtener stock de quimicos: ", error)
      }
    }
    TablaStock()
  }, []);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div>
        <Navbar Titulo="STOCK DE QUIMICOS" color={"alpacladd"} plantaLogo={AlpaLogo} />
      </div>

      {/* Contenido principal */}
      <div style={contentStyle}>
        <TableContainer component={Paper} style={tableContainerStyle}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#1A4862",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  Químico
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1A4862",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                  align="center"
                >
                  Cantidad
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataStock.map((chemical, index) => (
                <TableRow
                  key={index}
                  style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff" }}
                >
                  <TableCell>{chemical.quimico}</TableCell>
                  <TableCell align="center">{chemical.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
      </footer>
    </div>
  );
};

export default StockDeQuimicos;
