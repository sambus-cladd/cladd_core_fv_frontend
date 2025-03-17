import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#5c7063", "#4b5e4f", "#2c4d5a", "#1f3c47"];

const StockDepositosChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>No hay datos disponibles</Typography>;
  }

  const nombresPersonalizados = {
    "TERMINA-ALPA": "ALMACEN",
    "CNT-FAC": "CONTENEDOR FACT",
    "FAC-TERMNA-ALPA": "ALMACEN FACT",
    "CNT": "CONTENEDOR",
  };

  const formattedData = data.map((item) => ({
    name: nombresPersonalizados[item.DEPOSI] || item.DEPOSI,
    value: item.TOTAL_KILOMETROS,
  }));

  return (
    <Box sx={{ textAlign: "center", mt: 3, width: "100%", maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Stock de Producto Terminado
      </Typography>

      {/* Contenedor Responsivo */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="40%"
            innerRadius="40%"
            outerRadius="60%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} km`} />
          <Legend verticalAlign="bottom" height={50} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockDepositosChart;


