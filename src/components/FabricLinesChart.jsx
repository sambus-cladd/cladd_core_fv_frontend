import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#5c7063", "#1f3c47"];

const FabricLinesChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item.grupo_articulo_final,
    value: Number(item.suma_de_metros),
  }));

  return (
    <Box sx={{ textAlign: "center", mt: 3, width: "100%", maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Distribución por Línea de Revisado
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

export default FabricLinesChart;

