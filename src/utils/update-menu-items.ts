interface PageConfig {
  ACTIVE: boolean;
  icon?: string;
}

type PageList = Record<string, PageConfig>;

interface MenuItem {
  ROUTE?: string;
  TYPE?: string;
  ICON?: string;
  CHILDREN?: MenuItem[];
  [key: string]: unknown;
}

/**
 * Update menu items by filtering inactive routes and assigning icons to COLLAPSE items.
 */
export const updateMenuItems = (
  pageList: PageList,
  routeMapping: MenuItem[],
): MenuItem[] => {
  const isInactive = (route?: string): boolean =>
    !!route && pageList[route]?.ACTIVE === false;
  const getIcon = (route?: string): string | undefined =>
    route ? pageList[route]?.icon : undefined;

  const addIcons = (modules: MenuItem[]): MenuItem[] => {
    return modules.flatMap((item) => {
      // skip inactive item immediately
      if (isInactive(item.ROUTE)) return [];

      // copy once up front (shallow)
      const newItem: MenuItem = { ...item };

      // attach icon for collapse type if available
      if (item.TYPE === "COLLAPSE") {
        const icon = getIcon(item.ROUTE);
        if (icon) newItem.ICON = icon;
      }

      // process children recursively
      if (item.CHILDREN && item.CHILDREN.length > 0) {
        const updatedChildren = addIcons(item.CHILDREN);
        if (updatedChildren.length === 0) {
          // all children filtered out => exclude parent
          return [];
        }
        newItem.CHILDREN = updatedChildren;
      }

      return [newItem];
    });
  };

  return addIcons(routeMapping);
};
