import axios from "axios";
import { useEffect, useState } from "react";
import ReporteStockCard from "./components/ReporteStockCard";
import { getStockRollosDeposito } from "../API/APIFunctions";
function StockDeRollos() {
    const [DataCard, setDataCard] = useState("");
    const [TotalStock, setTotalStock] = useState(0);
    const [DataTabla, setDataTabla] = useState(0);
    const [totalDenim, setTotalDenim] = useState(0);
    const [metrosDenim, setMetrosDenim] = useState(0);
    const [totalCrudo, setTotalCrudo] = useState(0);
    const [metrosCrudo, setMetrosCrudo] = useState(0);
    let DataRaw;
    async function fetchData() {
        try {
            let respuesta = await getStockRollosDeposito();
            console.log("DATA DE LA BD", respuesta)
            if (respuesta.data) {
                DataRaw = respuesta.data;
                if (Array.isArray(DataRaw.ArticuloStock) && DataRaw.ArticuloStock.length > 0) {
                    setDataCard(DataRaw.ArticuloStock);
                }
                setTotalCrudo(DataRaw.CantidadCrudo);
                setTotalDenim(DataRaw.CantidadDenim);
                setMetrosCrudo(DataRaw.MetrosCrudo);
                setMetrosDenim(DataRaw.MetrosDenim);
                setTotalStock(DataRaw.TotalStock);
                if (Array.isArray(DataRaw.StockDetalles) && DataRaw.StockDetalles.length > 0) {
                    setDataTabla(DataRaw.StockDetalles);
                }
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        fetchData(); // execute immediately
        const intervalId = setInterval(() => {
            fetchData();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>

            <ReporteStockCard DataCard={DataCard} TotalStock={TotalStock} DataTabla={DataTabla} denim={totalDenim} crudo={totalCrudo} metrosDenim={metrosDenim} metrosCrudo={metrosCrudo} />
        </>)
}

export default StockDeRollos;