import NavItem from "./NavItem";

// ==============================|| NAVIGATION - LIST GROUP (Flattened - No Accordion) ||============================== //

interface NavGroupProps {
  item: {
    MODULEDESC?: string;
    CHILDREN?: Array<any>;
  };
}

const NavGroup = ({ item }: NavGroupProps) => {
  // Recursive function to flatten all menu items while preserving sequence
  const flattenMenuItems = (menuItems: Array<any>): Array<any> => {
    const flattened: Array<any> = [];
    
    // Sort items by sequence first
    const sorted = [...(menuItems || [])].sort((a, b) => (a.SEQUENCE ?? 0) - (b.SEQUENCE ?? 0));
    
    sorted.forEach((menuItem) => {
      if (menuItem.REVEAL === true) {
        if (menuItem.TYPE === "COLLAPSE" && menuItem.CHILDREN) {
          // If it's a collapse, flatten its children and add them directly
          const children = flattenMenuItems(menuItem.CHILDREN);
          flattened.push(...children);
        } else if (menuItem.TYPE === "ITEM") {
          // If it's an item, add it directly
          flattened.push(menuItem);
        }
      }
    });
    
    return flattened;
  };

  // Filter and flatten all CHILDREN (sorting is handled in flattenMenuItems)
  const filteredChildren = item.CHILDREN?.filter((menuItem) => menuItem.REVEAL === true) || [];

  // Flatten all items (remove accordion structure)
  const flattenedItems = flattenMenuItems(filteredChildren);

  // Generate nav items directly without accordion
  const navItems = flattenedItems.map((menuItem) => {
    if (menuItem.TYPE === "ITEM") {
      return <NavItem key={menuItem.ID} item={menuItem} level={1} />;
    }
    return null;
  }).filter(Boolean);

  return <>{navItems}</>;
};

export default NavGroup;
