import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#a7c2b0", "#3b6778", "#4A7B8D", "#3b6778"];

const FabricLinesChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item.grupo_articulo_final,
    value: Number(item.suma_de_metros),
  }));

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Distribución por Línea
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

export default FabricLinesChart;
