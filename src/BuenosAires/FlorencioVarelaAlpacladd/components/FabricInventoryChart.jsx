import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#a7c2b0", "#8ea995", "#4A7B8D", "#3b6778"];

const FabricInventoryChart = ({ data }) => {
  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Distribución de Inventario de Tela
      </Typography>
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} km`} />
        <Legend />
      </PieChart>
    </Box>
  );
};

export default FabricInventoryChart;
