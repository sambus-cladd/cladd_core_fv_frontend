/** Estilos compartidos Alpacladd para pestañas PCP (excepto Confirmar Producción). */
import { colors, typography, shadows } from "../../../../../styles/alpacladdFvDesignTokens";

export const pcpCardSx = {
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(26, 72, 98, 0.08)",
  border: "1px solid rgba(26, 72, 98, 0.06)",
  backgroundColor: "#fff",
};

export const primaryBtnSx = {
  background: "linear-gradient(145deg, #2c4356, #1e2c3a)",
  fontFamily: "Poppins",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "10px",
  boxShadow: "none",
  "&:hover": { background: "#1A4862" },
};

export const secondaryBtnSx = {
  fontFamily: "Poppins",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "10px",
  borderColor: "rgba(26, 72, 98, 0.35)",
  color: colors.brand,
};

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "Poppins",
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Poppins",
  },
};

export const sectionTitleSx = {
  ...typography.cardTitle,
  mb: 0.5,
};

export const sectionMutedSx = {
  fontFamily: typography.fontFamily,
  color: colors.textMuted,
  fontSize: "0.85rem",
  mb: 2,
};

export const filterBarSx = {
  ...pcpCardSx,
  p: 2,
  mb: 2,
};

export const tableWrapSx = {
  ...pcpCardSx,
  p: 1,
  overflow: "hidden",
};

export const dialogTitleSx = {
  background: "linear-gradient(145deg, #2c4356, #1e2c3a)",
  color: "#fff",
  fontFamily: "Poppins",
  fontWeight: 700,
};

export const dataGridHeaderSx = {
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgba(26, 72, 98, 0.08)",
    fontFamily: "Poppins",
    fontWeight: 700,
    color: colors.brand,
  },
  "& .MuiDataGrid-cell": {
    fontFamily: "Poppins",
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "rgba(26, 72, 98, 0.03)",
  },
};

export const headCellsBg = "rgba(26, 72, 98, 0.12)";
export const rowCellsBg = "rgba(26, 72, 98, 0.04)";

export { colors, typography, shadows };
