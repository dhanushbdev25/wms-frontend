import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import {
  SkuData,
  SkuDetailById,
  SkuDetails,
  StorageLocationData,
} from "../../../types/sku";
import { RootState } from "../../store";
import { ApiResponse, IGenericResponse } from "../types";
import {
  GetSkuLocationDetailArg,
  ManageSkuArg,
} from "../warehouse-management-validators/warehouse.validator";

export const skuApi = createApi({
  reducerPath: "skuApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/`,
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
  // refetchOnMountOrArgChange: true,
  tagTypes: ["Skus", "Sku", "Locations"],

  endpoints: (builder) => ({
    getAllSkuByWarehouseId: builder.query<ApiResponse<SkuDetails[]>, number>({
      query: (id) => `storage-management/variant/warehouse/${id}`,
      providesTags: ["Skus"],
    }),
    getAllStorageLocationsByWarehouseId: builder.query<
      ApiResponse<StorageLocationData[]>,
      number
    >({
      query: (id) => `storage-management/location/warehouses/locations/${id}`,
      providesTags: ["Locations"],
    }),
    getAllSku: builder.query<ApiResponse<SkuData[]>, void>({
      query: () => "materials/variants",
      providesTags: ["Skus"],
    }),
    manageSku: builder.mutation<IGenericResponse, ManageSkuArg>({
      query: ({ id, ...body }) => {
        return id
          ? {
              url: `storage-management/variant/update/${id}`,
              method: "PATCH",
              body,
            }
          : {
              url: "storage-management/variant/create",
              method: "POST",
              body,
            };
      },
      invalidatesTags: (_result, _error, { id }) =>
        id ? [{ type: "Sku", id }, "Skus"] : ["Skus"],
    }),

    getSkuLocationDetail: builder.query<
      ApiResponse<SkuDetailById>,
      GetSkuLocationDetailArg
    >({
      query: ({ warehouseId, id }) =>
        `storage-management/variant/variant/${id}/warehouse/${warehouseId}`,
      providesTags: (_result, _error, { id }) => [{ type: "Sku", id }],
    }),
    postShortClose: builder.mutation<any, any>({
      query: (body) => ({
        url:`webhook/sales-order/short-close`,
        method:'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAllSkuByWarehouseIdQuery,
  useGetAllStorageLocationsByWarehouseIdQuery,
  useGetAllSkuQuery,
  useManageSkuMutation,
  useGetSkuLocationDetailQuery,
  useLazyGetSkuLocationDetailQuery,

  usePostShortCloseMutation,
} = skuApi;
