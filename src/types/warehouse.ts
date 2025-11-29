export interface WarehouseData {
  WAREHOUSE_ID: number;
  WAREHOUSE_NAME: string;
  WAREHOUSE_CODE: string;
  STATUS: string;
  ADDRESS: string;
  STATE: string;
  CITY: string;
  PIN_CODE: string;
  MANAGER_ID: number;
}

export interface GetAllWarehouseResponse {
  success: boolean;
  data: WarehouseData[];
}

export interface GetWarehouseResponse {
  success: boolean;
  data: WarehouseDetails;
}

export interface WarehouseDetails {
  WAREHOUSE_ID: number;
  WAREHOUSE_CODE: string;
  WAREHOUSE_NAME: string;
  WAREHOUSE_TYPE: string;
  STATUS: string;
  ADDRESS: string;
  STATE: string;
  CITY: string;
  PIN_CODE: string;
  MANAGER_ID: number;
  Manager: {
    USERNAME: string;
    EMAIL: string;
  };
}

export interface Hierarchy {
  levelOrder: number;
  levelName: string;
}

export interface Attribute {
  attributeCode: string;
  attributeName: string;
  dataType: string;
}

export interface Location {
  locationCode: string;
  locationName: string;
  hierarchyLevel: string;
  parentLocationCode?: string;
}

export interface GetAllUserResponse {
  message: string;
  data: User[];
}

interface User {
  ID: number;
  USERID: number;
  OUID: number;
  ISDEFAULT: boolean;
  ACTIVE: boolean;
  createdAt: string;
  updatedAt: string;
  USER: {
    USERNAME: string;
  };
}
