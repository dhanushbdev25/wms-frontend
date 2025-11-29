import {
  Box,
  Collapse,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { useState } from "react";
import NavGroup from "./NavGroup";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const NavCollapse = ({ menuItem }: any) => {
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>({});

  const handleCollapseToggle = (id: string) => {
    setOpenCollapse((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <Box key={menuItem.ID}>
      <ListItemButton
        onClick={() => handleCollapseToggle(menuItem.ID)}
        sx={{
          pl: 2,
          py: 1,
          color: "#637098",
          display: 'flex',
          justifyContent: 'space-between',
          "&:hover": {
            borderRadius: "8px",
            bgcolor: "action.hover",
          },
          "&.Mui-selected": {
            borderRight: `2px solid primary.main`,
            "&:hover": {
              color: "#1e2a3a",
              bgcolor: "action.hover",
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {menuItem.ICON && (
            <ListItemIcon sx={{ color: "#868d99" }}>
              <menuItem.ICON />
            </ListItemIcon>
          )}
          <Grid item sx={{ fontSize: "14px" }}>
            {menuItem.MODULEGROUPDESC}
          </Grid>
        </Box>
        {openCollapse[menuItem.ID] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openCollapse[menuItem.ID]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NavGroup item={menuItem} />
        </List>
      </Collapse>
    </Box>
  );
};

export default NavCollapse;
