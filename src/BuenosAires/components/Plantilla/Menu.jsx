import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import { tabsBand, tabsCapsule, tabsRootSx } from "../../../styles/alpacladdFvDesignTokens";

function CustomTabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ width: "100%", p: 2 }}>{children}</Box>;
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Menu = ({
  defaultTab = 1,
  tabsConfig = [],
  value: controlledValue,
  onChange: controlledOnChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultTab);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (nextValue) => {
    if (!isControlled) setInternalValue(nextValue);
  };

  const handleChange = (event, newValue) => {
    const tab = tabsConfig[newValue];

    if (tab?.external && tab?.href) {
      const win = window.open(tab.href, tab.target || "_blank", "noopener,noreferrer");
      if (win) win.focus();
      return;
    }

    if (typeof controlledOnChange === "function") {
      controlledOnChange(event, newValue, tab);
      return;
    }

    setValue(newValue);
  };

  if (!Array.isArray(tabsConfig) || tabsConfig.length === 0) {
    return null;
  }

  return (
    <>
      <Box sx={tabsBand}>
        <Box sx={tabsCapsule}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              ...tabsRootSx,
              minHeight: 56,
              "& .MuiTab-root": {
                ...tabsRootSx["& .MuiTab-root"],
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 56,
                minWidth: 72,
                py: 0.4,
                px: 1,
                fontSize: { xs: "0.62rem", sm: "0.68rem", md: "0.72rem" },
                textTransform: "uppercase",
                lineHeight: 1.2,
                gap: 0.35,
              },
              "& .MuiTab-iconWrapper": {
                marginBottom: 0,
                fontSize: 18,
              },
            }}
          >
            {tabsConfig.map((tab, index) => (
              <Tab
                key={tab.key || index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="top"
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1700,
          mx: "auto",
          boxSizing: "border-box",
          px: { xs: 1.2, md: 2, lg: 2.4 },
          py: { xs: 1.2, md: 1.6 },
        }}
      >
        {tabsConfig.map((tab, index) => (
          <CustomTabPanel key={tab.key || index} value={value} index={index}>
            {tab.component}
          </CustomTabPanel>
        ))}
      </Box>
    </>
  );
};

Menu.propTypes = {
  defaultTab: PropTypes.number,
  tabsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      component: PropTypes.node,
      external: PropTypes.bool,
      href: PropTypes.string,
      target: PropTypes.string,
      key: PropTypes.string,
    })
  ),
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default Menu;
