import { combineReducers, AnyAction } from "redux";

import { authApi } from "../api/auth/authApi";
import { configurationAPI } from "../api/configuration/configurationAPI";
import { dynamicApi } from "../api/configuration/dynamicApi";
import { inboundApi } from "../api/Inbound/inboundApi";
import { materialManagementApi } from "../api/material-management/api";
import { showSkuApi } from "../api/material-management/showSkuApi";
import { outboundApi } from "../api/outbound/api";
import { skuApi } from "../api/warehouse-management/skuApi";
import { storageHierarchyApi } from "../api/warehouse-management/storageHierarchyApi";
import { storageLocationApi } from "../api/warehouse-management/storageLocationApi";
import { warehouseApi } from "../api/warehouse-management/warehouseApi";

import { LOGOUT, AuthActionTypes } from "./actions";
import menu from "./menu";
import routeMapping from "./routeMapping";
import updateMaterial from "./storageAdd";
import userinfo from "./userInfo";
import { SalesReturnApi } from "../api/sales-return/salesReturnApi";
import { onholdItemsApi } from "../api/onhold-items/onhold-api";
import { assemblyApi } from "../api/assembly/assembly-api";
import { warrantyApi } from "../api/warranty/warranty-api";
import { attachmentsApi } from "../api/blob-attachements/attachements.api";

const rootReducer = combineReducers({
  menu,
  user: userinfo,
  routeMapping,
  material: updateMaterial,
  [authApi.reducerPath]: authApi.reducer,
  [configurationAPI.reducerPath]: configurationAPI.reducer,
  [dynamicApi.reducerPath]: dynamicApi.reducer,
  [storageLocationApi.reducerPath]: storageLocationApi.reducer,
  [warehouseApi.reducerPath]: warehouseApi.reducer,
  [storageHierarchyApi.reducerPath]: storageHierarchyApi.reducer,
  [skuApi.reducerPath]: skuApi.reducer,
  [showSkuApi.reducerPath]: showSkuApi.reducer,
  [materialManagementApi.reducerPath]: materialManagementApi.reducer,
  [inboundApi.reducerPath]: inboundApi.reducer, //....
  [outboundApi.reducerPath]: outboundApi.reducer,
  [SalesReturnApi.reducerPath] : SalesReturnApi.reducer,
  [onholdItemsApi.reducerPath] :onholdItemsApi.reducer,
  [assemblyApi.reducerPath]:assemblyApi.reducer,
  [warrantyApi.reducerPath]:warrantyApi.reducer,
  [attachmentsApi.reducerPath]: attachmentsApi.reducer,
});

// Handle the LOGOUT action
const appReducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === LOGOUT) {
    localStorage.clear();
    state = undefined;
  }
  return rootReducer(state, action as AuthActionTypes);
};

export default appReducer;
