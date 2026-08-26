import { Box, Typography } from "@mui/material";
import { formatKmEntero } from "../../../styles/alpacladdFvDesignTokens";

function formatPercentEs(p) {
  if (p == null || Number.isNaN(Number(p))) return "0%";
  const n = Number(p);
  const rounded = Math.round(n * 10) / 10;
  return `${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
  }).format(rounded)}%`;
}

function rowsFromRechartsPayload(payload) {
  if (!payload?.length) return [];
  return payload.map((entry) => {
    const name = entry.payload?.name ?? entry.value ?? "";
    const value = entry.payload?.value != null ? Number(entry.payload.value) : null;
    const total = entry.payload?.__totalForLegend;
    const percent =
      value != null && total > 0 ? (value / total) * 100 : value != null && value === 0 ? 0 : null;
    return { color: entry.color, name, value, percent };
  });
}

function legendLine(row) {
  const name = row.name ?? "";
  const km = row.value != null ? Number(row.value) : null;
  const pct = row.percent != null ? Number(row.percent) : null;
  if (km != null && !Number.isNaN(km) && pct != null && !Number.isNaN(pct)) {
    return `${name}: ${formatKmEntero(km)} km (${formatPercentEs(pct)})`;
  }
  return name;
}

/**
 * Leyenda para donas: texto completo; opcional `value` + `percent` para "Nombre: X km (Y%)".
 */
function ChartLegendList(props) {
  const { payload, items, sx: legendSx } = props || {};
  const rows = (items && items.length ? items : rowsFromRechartsPayload(payload)) || [];
  if (!rows.length) return null;

  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: 0,
        mt: 0,
        mb: 0,
        px: 0,
        width: "100%",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        columnGap: 0.85,
        rowGap: 0.28,
        alignItems: "start",
        ...legendSx,
      }}
    >
      {rows.map((row, i) => (
        <Box
          component="li"
          key={`${row.name}-${i}`}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0.5,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "2px",
              bgcolor: row.color,
              flexShrink: 0,
              mt: 0.38,
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              lineHeight: 1.34,
              fontFamily: '"Poppins", sans-serif',
              color: "#4a6177",
              fontWeight: 500,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              textAlign: "left",
              flex: 1,
              minWidth: 0,
            }}
          >
            {legendLine(row)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default ChartLegendList;
