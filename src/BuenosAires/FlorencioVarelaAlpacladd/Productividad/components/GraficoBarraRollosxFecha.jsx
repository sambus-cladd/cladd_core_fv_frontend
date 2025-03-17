import React from 'react';
import Chart from 'react-apexcharts';

const GraficoBarraRollosxFecha = ({ data, label = "Cantidad de rollos por fecha", ingreso}) => {
    // Extraer las fechas y las cantidades de rollos de los datos proporcionados
    let fechas;
    if (!data) {
        return <div>No hay datos para mostrar</div>;
    }
    if (!ingreso) {
        fechas = data.map((item) => {
            const [dia, mes, anio] = item.fecha_salida.split('-'); // Suponiendo formato dd-mm-aaaa
            return `${dia}/${mes}`; // Formato dd/mm
        });
    } else {
        fechas = data.map((item) => {
            const [dia, mes, anio] = item.fecha_ingreso.split('-'); // Suponiendo formato dd-mm-aaaa
            return `${dia}/${mes}`; // Formato dd/mm
        });
    }

    const cantidades = data.map((item) => item.cantidad_rollos);

    const options = {
        chart: {
            type: 'bar',
        },
        xaxis: {
            categories: fechas, // Fechas en el eje X
        },
        title: {
            text: label,
            align: 'center',
        },
    };

    const series = [
        {
            name: 'Cantidad de Rollos',
            data: cantidades, // Cantidad de rollos en el eje Y
        },
    ];

    return (
        <div>
            <Chart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default GraficoBarraRollosxFecha;