import { Box, List } from "@mui/material";
import NavGroup from "./NavGroup";
import { useAppSelector } from "../../../../../store/store";
import { Sections } from "../../../../../routes/screenList";
import { updateMenuItems } from "../../../../../utils/update-menu-items";

// ==============================|| DRAWER CONTENT - NAVIGATION (No Parent Groups) ||============================== //

const Navigation = () => {
  const routeMapping = useAppSelector(
    (state: any) => state.routeMapping.routeMapping
  );

  // Update and sort menu items by SEQUENCE
  const menuItems = updateMenuItems(
    Sections,
    JSON.parse(JSON.stringify(routeMapping))
  ).sort((a: any, b: any) => (a.SEQUENCE ?? 0) - (b.SEQUENCE ?? 0));

  // Recursive function to extract all ITEMs from groups and collapses
  const extractAllItems = (items: any[]): any[] => {
    const allItems: any[] = [];
    
    items.forEach((item: any) => {
      if (item.REVEAL === true) {
        if (item.TYPE === "ITEM") {
          // Direct item - add it
          allItems.push(item);
        } else if (item.CHILDREN && item.CHILDREN.length > 0) {
          // Has children - recursively extract items
          const childItems = extractAllItems(item.CHILDREN);
          allItems.push(...childItems);
        }
      }
    });
    
    return allItems;
  };

  // Extract all items from all groups (remove parent group structure)
  const allNavItems: any[] = [];
  
  menuItems.forEach((item: any) => {
    if (item.TYPE === "GROUP" && item.CHILDREN) {
      // Extract all items from this group
      const groupItems = extractAllItems(item.CHILDREN);
      allNavItems.push(...groupItems);
    }
  });

  // Sort all items by sequence
  const sortedItems = allNavItems.sort((a: any, b: any) => (a.SEQUENCE ?? 0) - (b.SEQUENCE ?? 0));

  // Create a temporary group structure for NavGroup to process
  const tempGroup = {
    CHILDREN: sortedItems,
  };

  return (
    <Box
      sx={{
        pt: 1,
        pb: 2,
        overflowY: "auto",
        maxHeight: "calc(100vh - 64px)",
        scrollbarWidth: "thin",
        scrollbarColor: "#D9D9D9 transparent",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#D9D9D9",
          borderRadius: "3px",
          "&:hover": {
            backgroundColor: "#BFBFBF",
          },
        },
      }}
    >
      <List sx={{ py: 0 }}>
        <NavGroup item={tempGroup} />
      </List>
    </Box>
  );
};

export default Navigation;
