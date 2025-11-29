import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { RootState } from "../../store";
import {
  AssemblyApiResponseType,
  AssemblyOrderApiType,
} from "../assembly-validator/assembly.validator";

export const assemblyApi = createApi({
  reducerPath: "assemblyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/assembly`,
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
  tagTypes: ["assemblyOrderById" ,"allAssembly"],

  endpoints: (builder) => ({
    getAssemblyApi: builder.query<AssemblyApiResponseType, void>({
      query: () => `/`,
      providesTags:["allAssembly"]
    }),
    postCreateAssemblyOrder: builder.mutation<AssemblyOrderApiType, any>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
      }),
      invalidatesTags:["allAssembly"]
    }),
    getAssemblyOrderById: builder.query<any, void>({
      query: (id) => `/${id}`,
      providesTags:["assemblyOrderById"]
    }),
    getAssemblyOrderSummary: builder.query<unknown, void>({
      query: (id) => `/${id}/summary`,
    }),
    getSKUbyWarehouseId: builder.query<any, any>({
      query: (warehouseId) => `/warehouse/${warehouseId}/sku`,
    }),

    //----------------------Quality inspection-------------------------

    getQualityInspection: builder.query<any, any>({
      query: (id) => `${id}/quality-inspection`,
    }),
    postQualityInspection: builder.mutation<any, any>({
      query: ({ id, itemId, body }) => ({
        url: `/${id}/quality-inspection/${itemId}`,
        method: "POST",
        body,
      }),
      invalidatesTags:["assemblyOrderById"]
    }),
    
    //------------------------finished-goods---------------------------
    postFinishGood:builder.mutation<any,any>({
      query:({orderID,body})=>({
        url:`/${orderID}/finish-goods`,
        method :"POST",
        body,
      }),
      invalidatesTags:["assemblyOrderById"]
    })
  }),
});

export const {
  useGetAssemblyApiQuery,
  usePostCreateAssemblyOrderMutation,
  useGetAssemblyOrderByIdQuery,
  useGetAssemblyOrderSummaryQuery,
  useGetSKUbyWarehouseIdQuery,
  //----------------------Quality inspection-------------------------

  useGetQualityInspectionQuery,
  usePostQualityInspectionMutation,

  usePostFinishGoodMutation,
} = assemblyApi;
