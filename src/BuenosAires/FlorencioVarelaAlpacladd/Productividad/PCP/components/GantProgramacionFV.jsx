import { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddCardIcon from "@mui/icons-material/AddCard";
import SearchIcon from "@mui/icons-material/Search";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import DvrIcon from "@mui/icons-material/Dvr";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TimelineIcon from "@mui/icons-material/Timeline";
import ReplayIcon from "@mui/icons-material/Replay";

import HeaderYFooter from "../../../../../components/Plantilla/HeaderYFooter";
import Menu from "../../../../../components/Plantilla/Menu";
import FormularioGantPpc from "./FormularioGantPcp";
import HistoricoGantt from "./TablaHistoricoGant";
import MetrosXArticulos from "./MetrosXArticulos";
import ModificacionGantPcp from "./ModificacionGantPcp";
import ConfirmarProduccion from "./ConfirmarProduccion";
import TrazabilidadOrdenes from "./TrazabilidadOrdenes";
import FormularioReprocesos from "./FormularioReprocesos";

export const GantProgramacionFV = () => {
  const [value, setValue] = useState(2);

  useEffect(() => {
    document.title = "PCP - Florencio Varela";
  }, []);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  const handleHistoricoNavigate = (_event, newValue) => {
    setValue(newValue);
  };

  const tabsConfig = useMemo(
    () => [
      {
        key: "home",
        label: "Home",
        icon: <HomeIcon />,
        component: <Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" replace />,
      },
      {
        key: "grafico",
        label: "Gráfico Producción",
        icon: <DvrIcon />,
        external: true,
        href: "/BuenosAires/FlorencioVarela/Productividad/PCP/GraficoGantFV",
        target: "_blank",
      },
      {
        key: "registro",
        label: "Registro Producción",
        icon: <AddCardIcon />,
        component: <FormularioGantPpc />,
      },
      {
        key: "modificaciones",
        label: "Modificaciones",
        icon: <DriveFileRenameOutlineIcon />,
        component: <ModificacionGantPcp />,
      },
      {
        key: "metros",
        label: "Metros x Artículo",
        icon: <ManageSearchIcon />,
        component: <MetrosXArticulos />,
      },
      {
        key: "historico",
        label: "Histórico",
        icon: <SearchIcon />,
        component: (
          <HistoricoGantt
            handleChange={(_event, tabIndex) => handleHistoricoNavigate(_event, tabIndex)}
          />
        ),
      },
      {
        key: "reprocesos",
        label: "Reprocesos",
        icon: <ReplayIcon />,
        component: <FormularioReprocesos />,
      },
      {
        key: "confirmar",
        label: "Confirmar Producción",
        icon: <FactCheckIcon />,
        component: <ConfirmarProduccion />,
      },
      {
        key: "trazabilidad",
        label: "Trazabilidad",
        icon: <TimelineIcon />,
        component: <TrazabilidadOrdenes />,
      },
    ],
    []
  );

  return (
    <HeaderYFooter titulo="PCP" color="alpacladd" showMainMenu={false}>
      <Menu tabsConfig={tabsConfig} value={value} onChange={handleChange} />
    </HeaderYFooter>
  );
};

export default GantProgramacionFV;
