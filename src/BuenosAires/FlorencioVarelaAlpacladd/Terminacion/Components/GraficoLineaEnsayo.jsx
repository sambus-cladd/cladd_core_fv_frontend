import React from 'react';
import { Box } from '@mui/material';
import Chart from 'react-apexcharts';

function GraficoLineaEnsayo({ Serie, ensayo, espec }) {
    let ensayos = [];
    let label = "";
    let unidad = "";
    let especificacion = { min: undefined, max: undefined };
    let topes = { min: undefined, max: undefined };

    switch (ensayo) {
        case 'Ancho':
            label = "Ancho";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.ancho_sin_lavar_cal) });
            });
            if (Array.isArray(espec) && espec[0] && espec[0].ESPEC_MAX && espec[0].ESPEC_MIN) {
                especificacion.min = espec[0].ESPEC_MIN;
                especificacion.max = espec[0].ESPEC_MAX;
                topes.min = especificacion.min - 2;
                topes.max = especificacion.max + 2;
            } else {
                topes.min = Math.min(...ensayos.map(e => e.y)) - 2;
                topes.max = Math.max(...ensayos.map(e => e.y)) + 2;
            }
            unidad = "[cm]";
            break;
    
        case 'RecuentoTrama':
            label = "Recuento De Trama";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.recuento_trama_cal) });
            });
            if (Array.isArray(espec) && espec[8] && espec[8].ESPEC_MAX && espec[8].ESPEC_MIN) {
                especificacion.min = espec[8].ESPEC_MIN;
                especificacion.max = espec[8].ESPEC_MAX;
                topes.min = especificacion.min - 1;
                topes.max = especificacion.max + 1;
            }
            unidad = " [p/'']";
            break;
    
        case 'EncogimientoTrama':
            label = "Encogimiento De Trama";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.estabilidad_trama_cal) });
            });
            if (Array.isArray(espec) && espec[1] && espec[1].ESPEC_MAX && espec[1].ESPEC_MIN) {
                especificacion.min = parseFloat(espec[1].ESPEC_MIN);
                especificacion.max = parseFloat(espec[1].ESPEC_MAX);
                topes.min = especificacion.min - 2;
                topes.max = especificacion.max + 2;
            }
            unidad = '[%]';
            break;
    
        case 'EncogimientoUrdimbre':
            label = "Encogimiento De Urdimbre";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.estabilidad_urdido_cal) });
            });
            if (Array.isArray(espec) && espec[2] && espec[2].ESPEC_MAX && espec[2].ESPEC_MIN) {
                especificacion.min = parseFloat(espec[2].ESPEC_MIN);
                especificacion.max = parseFloat(espec[2].ESPEC_MAX);
                topes.min = especificacion.min - 2;
                topes.max = especificacion.max + 2;
            }
            unidad = '[%]';
            break;
    
        case 'Elasticidad':
            label = "Elasticidad";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.elasticidad_lavada_cal) });
            });
            unidad = '[%]';
            break;
    
        case 'Deformacion':
            label = "Deformacion";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.deformacion_lavada_cal) });
            });
            break;
    
        case 'Peso':
            label = "Peso";
            Serie.forEach(elemento => {
                ensayos.push({ x: elemento.rutina, y: parseFloat(elemento.peso_sin_lavar_cal) });
            });
            if (Array.isArray(espec) && espec[5] && espec[5].ESPEC_MAX && espec[5].ESPEC_MIN) {
                especificacion.min = parseFloat(espec[5].ESPEC_MIN);
                especificacion.max = parseFloat(espec[5].ESPEC_MAX);
                topes.min = especificacion.min;
                topes.max = especificacion.max + 50;
            }
            unidad = '[g/m2]';
            break;
    
        default:
            break;
    }
    
    
    const data = {
        series: [{ name: label, data: ensayos }],
        options: {
            chart: { type: 'line', toolbar: { show: false } },
            title: {
                text: label,
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            stroke: {
                curve: 'straight',
                width: 2
            },
            yaxis: {
                min: topes.min,
                max: topes.max,
                title: {
                    text: unidad,
                    style: { fontSize: '12px', fontWeight: 600 }
                },
                
            },
            annotations: {
                yaxis: [
                    especificacion.min !== undefined && especificacion.max !== undefined && { y: especificacion.min, borderColor: '#C62E2E', label: { text: 'Min' } },
                    especificacion.min !== undefined && especificacion.max !== undefined && { y: especificacion.max, borderColor: '#C62E2E', label: { text: 'Max' } }
                ].filter(Boolean)
            }
        }
    };
    return (
        <Box p={1} textAlign="center">
            <Chart
                options={data.options}
                series={data.series}
                type="line"
                height="400"
            />
        </Box>
    );
}

export default GraficoLineaEnsayo;
