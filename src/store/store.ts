// third-party
import {
  Middleware,
  configureStore,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import Swal from "sweetalert2";

// project import
import { authApi } from "./api/auth/authApi";
import { configurationAPI } from "./api/configuration/configurationAPI";
import { dynamicApi } from "./api/configuration/dynamicApi";
import { inboundApi } from "./api/Inbound/inboundApi";
import { materialManagementApi } from "./api/material-management/api";
import { showSkuApi } from "./api/material-management/showSkuApi";
import { outboundApi } from "./api/outbound/api";
import { skuApi } from "./api/warehouse-management/skuApi";
import { storageHierarchyApi } from "./api/warehouse-management/storageHierarchyApi";
import { storageLocationApi } from "./api/warehouse-management/storageLocationApi";
import { warehouseApi } from "./api/warehouse-management/warehouseApi";
import appReducer from "./reducers";
import { SalesReturnApi } from "./api/sales-return/salesReturnApi";
import { onholdItemsApi } from "./api/onhold-items/onhold-api";
import { assemblyApi } from "./api/assembly/assembly-api";
import { warrantyApi } from "./api/warranty/warranty-api";
import { attachmentsApi } from "./api/blob-attachements/attachements.api";

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {    
    void Swal.fire({
      icon: "error",
      title: "Error",
      text: action.payload.data.msg || action.payload.data.message || action.payload.data.error.message,
    });
    if (action.payload?.status === 401) {
      console.error("error auth");
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware,
      configurationAPI.middleware,
      dynamicApi.middleware,
      warehouseApi.middleware,
      storageHierarchyApi.middleware,
      showSkuApi.middleware,
      skuApi.middleware,
      storageLocationApi.middleware,
      materialManagementApi.middleware,
      inboundApi.middleware, //..
      outboundApi.middleware,
      SalesReturnApi.middleware,
      onholdItemsApi.middleware,
      assemblyApi.middleware,
      warrantyApi.middleware,
      attachmentsApi.middleware,
      rtkQueryErrorLogger,
    ]),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
