import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import {
  GetAllUserResponse,
  GetAllWarehouseResponse,
  GetWarehouseResponse,
} from "../../../types/warehouse";
import { RootState } from "../../store";
import { IGenericResponse } from "../types";
import {
  ManageWarehouseArg,
  WarehouseIdArg,
} from "../warehouse-management-validators/warehouse.validator";

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/storage-management/all-warehouses`,
    prepareHeaders: async (headers, { getState }) => {
      const userState = (getState() as RootState).user;
      const token = userState.userInfo.token;
      const wareHouseID = userState.selectWareHouse;
      const ROLEID = userState.selectedRole
        ? userState.selectedRole
        : userState.userInfo.defaultRole.ROLEID;
      if (token && wareHouseID) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("WAREHOUSE_ID", wareHouseID);
        headers.set("ROLEID", ROLEID);
      } else {
        await Swal.fire({
          text: "API headers missing",
          icon: "error",
          title: "API Error",
        });
      }
      return headers;
    },
  }),
  tagTypes: ["Warehouses", "Warehouse", "Users"],

  endpoints: (builder) => ({
    getAllWarehouses: builder.query<GetAllWarehouseResponse, void>({
      query: () => "/",
      providesTags: ["Warehouses"],
    }),

    getWarehouseDetails: builder.query<GetWarehouseResponse, WarehouseIdArg>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Warehouse", id }],
    }),

    manageWarehouse: builder.mutation<IGenericResponse, ManageWarehouseArg>({
      query: ({ id, ...body }) =>
        id
          ? {
              url: `/${id}`,
              method: "PATCH",
              body,
            }
          : {
              url: "/",
              method: "POST",
              body,
            },
      invalidatesTags: (_result, _error, { id }) =>
        id ? [{ type: "Warehouse", id }, "Warehouses"] : ["Warehouses"],
    }),

    // ✅ No args → void
    getAllUser: builder.query<GetAllUserResponse, void>({
      query: () => "/users",
    }),
  }),
});

export const {
  useGetAllWarehousesQuery,
  useGetWarehouseDetailsQuery,
  useLazyGetWarehouseDetailsQuery,
  useManageWarehouseMutation,
  useGetAllUserQuery,
} = warehouseApi;
