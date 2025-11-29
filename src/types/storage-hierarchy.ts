export interface StorageHierarchyData {
  HIERARCHY_ID: number;
  WAREHOUSE_ID: number;
  LEVEL_ORDER: number;
  LEVEL_NAME: string;
}

export interface StorageHierarchy {
  hierarchyId?: number;
  levelOrder: number;
  levelName: string;
}
