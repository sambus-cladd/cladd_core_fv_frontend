import { Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import DashboardSurface from "./DashboardSurface";
import ChartLegendList from "./ChartLegendList";
import { chartPieColors, formatKmEntero } from "../../../styles/alpacladdFvDesignTokens";

const CHART_HEIGHT = 232;

const FabricLinesChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item.grupo_articulo_final,
    value: Number(item.suma_de_metros),
  }));

  const total = formattedData.reduce((s, e) => s + (Number(e.value) || 0), 0);
  const legendItems = formattedData.map((entry, index) => ({
    name: entry.name,
    color: chartPieColors[index % chartPieColors.length],
    value: Number(entry.value) || 0,
    percent: total > 0 ? ((Number(entry.value) || 0) / total) * 100 : 0,
  }));

  return (
    <DashboardSurface
      title="Distribución por línea de revisado"
      compactHeader
      fillColumn
      dividerSx={{ my: 0.15 }}
      sx={{ p: { xs: 0.45, md: 0.55 }, minHeight: 0, flex: 1, width: "100%" }}
    >
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexShrink: 0, width: "100%" }}>
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius="17%"
                outerRadius="88%"
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={false}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartPieColors[index % chartPieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${formatKmEntero(value)} km`, name]}
                labelStyle={{ fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pt: 0.25,
          }}
        >
          <ChartLegendList items={legendItems} />
        </Box>
      </Box>
    </DashboardSurface>
  );
};

export default FabricLinesChart;
