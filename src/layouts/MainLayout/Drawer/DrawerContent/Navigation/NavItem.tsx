import { forwardRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// material-ui
import {
  Avatar,
  Chip,
  Grid,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

// project import
import { activeItem, openDrawer } from "../../../../../store/reducers/menu";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { Screens } from "../../../../../routes/screenList";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }: any) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const { drawerOpen, openItem } = useAppSelector((state: any) => state.menu);

  let itemTarget = "_self";
  if (item.TARGET) {
    itemTarget = "_blank";
  }

  let listItemProps: any = {
    component: forwardRef((props: any, ref: any) => (
      <Link ref={ref} {...props} to={item.ROUTE} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.ROUTE, target: itemTarget };
  }

  const itemHandler = (id: any) => {
    dispatch(activeItem({ openItem: [id] }));
    dispatch(openDrawer({ drawerOpen: false }));
  };

  // Get icon from Screens using MODULENAME
  const screenConfig = item.MODULENAME ? Screens[item.MODULENAME] : null;
  const Icon = screenConfig?.icon || item.icon;
  const itemIcon = Icon ? (
    <Icon style={{ fontSize: drawerOpen ? "1rem" : "1.25rem" }} />
  ) : (
    false
  );

  const isSelected =
    openItem.findIndex((id: any) => id === item.MODULENAME) > -1;

  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.ROUTE)) {
      dispatch(activeItem({ openItem: [item.ROUTE] }));
    }
  }, [pathname, item.ROUTE, dispatch]);

  const textColor = "#32363A"; // SAP Fiori text
  const iconSelectedColor = "#F57C00"; // Professional Yellow/Orange primary
  const hoverBackground = "#F5F6FA"; // SAP Fiori hover background
  const selectedBackground = "#FFF3E0"; // Professional Yellow/Orange selected background

  return (
    <ListItemButton
      {...listItemProps}
      disabled={!item.ACTIVE}
      onClick={() => itemHandler(item.ID)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        // pl: drawerOpen ? `${level * 24 + 16}px` : 1.5, // SAP Fiori spacing
        // pr: 2,
        py: 1, // SAP Fiori vertical padding
        my: 0.25, // Small margin between items
        // mx: 1,
        borderRadius: "4px", // SAP Fiori border radius
        minHeight: "40px", // SAP Fiori minimum height
        color: isSelected ? iconSelectedColor : textColor,
        backgroundColor: isSelected ? selectedBackground : "transparent",
        "&:hover": {
          backgroundColor: isSelected ? selectedBackground : hoverBackground,
          color: iconSelectedColor,
        },
        "&.Mui-selected": {
          backgroundColor: selectedBackground,
          color: iconSelectedColor,
          "&:hover": {
            backgroundColor: selectedBackground,
          },
        },
        "&.Mui-disabled": {
          opacity: 0.5,
          color: "#6A6D70",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 24, // SAP Fiori icon size
          color: "inherit",
          ...(!drawerOpen && {
            borderRadius: "4px",
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 0,
          }),
        }}
      >
        {itemIcon}
      </ListItemIcon>
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <Grid 
          sx={{
            color: "inherit",
            fontSize: "0.875rem", // SAP Fiori font size
            fontWeight: isSelected ? 500 : 400,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.MODULEDESC}
        </Grid>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
