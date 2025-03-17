import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#a7c2b0", "#8ea995", "#4A7B8D", "#3b6778"]; // Paleta de colores

const StockDepositosChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>No hay datos disponibles</Typography>;
  }

  // Formateamos los datos para Recharts
  const formattedData = data.map((item) => ({
    name: item.DEPOSI, 
    value: item.TOTAL_KILOMETROS,
  }));

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Distribución de Stock por Depósito
      </Typography>
      <PieChart width={600} height={400}>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
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
        <Legend />
      </PieChart>
    </Box>
  );
};

export default StockDepositosChart;

