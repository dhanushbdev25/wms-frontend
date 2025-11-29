export interface StorageLocation {
  locationId: number;
  locationCode: string;
  locationName: string;
  hierarchyId: number;
  hierarchyLevel: string;
  parentLocationId: number;
  condition: string;
  locationPurpose: string;
  maxSize: number;
  fullSize: number;
  availableSpace: number;
  status: string;
  occupied: number;
  availability: string;
  children?: StorageLocation[];
  expanded?: boolean;
}

export interface LocationOverview {
  locationId: number;
  locationName: string;
  hierarchyId: number;
  locationCode: string;
  hierarchyLevel: string;
  locationPurpose: string;
  condition: string;
  uom: string;
  status: string;
  availability: string;
  fullSize: number;
  maxSize: number;
  occupied: number;
  availableSpace: number;
  parentLocationId: number | null;
  parentLocationCode: string | null;
  parentLocationHierarchyLevel: string | null;
  numberOfMaterialVariants: number;
  numberOfSublocations: number;
  hierarchyCounts: Record<string, number>;
}

export interface LocationSkuDetails {
  variantCode: string;
  variantName: string;
  materialType: string;
  locationCode: string;
  occupied: number;
  assignedCapacity: number;
  maximumCapacity: number;
}


export interface SubLocations {
  locationCode: string;
  levelName: string;
  status: string;
  condition: string;
  locationPurpose: string;
  maxSize: number;
  fullSize: number;
  occupied: number;
  availability: string;
  availableSpace: number;
}
