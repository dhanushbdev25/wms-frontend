import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { RootState } from "../../store";
import {
  BinLocationArgs,
  BinLocationResponse,
  BinningResponse,
  BulkScanRequest,
  ContainerQualityInspectionArray,
  GrnResponse,
  InboundOrder,
  ItemsSchema,
  PackageApiResponse,
  StorageResponse,
} from "../inbound-validators/inbound.validator";
import { ApiResponse } from "../types";

export const inboundApi = createApi({
  reducerPath: "inboundApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/inbound`,
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
  tagTypes: ["inbound_putaway", "Package"],

  endpoints: (builder) => ({
    getInboundOrders: builder.query< ApiResponse<InboundOrder[]>, { statuses?: string } >({
      query: ({ statuses }) => {
        const params = new URLSearchParams();
        if (statuses) params.append("statuses", statuses);
        return `/?${params.toString()}`;
      },
    }),

    getPutawayItemsById: builder.query<StorageResponse, number>({
      query: (packingListId) => `${packingListId}/putaway-items`, //putaway -table-items
      providesTags:[ "inbound_putaway"],
    }),
    getPackageOrderById: builder.query<PackageApiResponse, number>({
      query: (id) => `/${id}`, //container and item quality api
      providesTags:["Package"],
    }),
    postPutAwayItems: builder.mutation<ApiResponse<BinningResponse>, number>({
      query: (LOCATION_ID) => ({
        url: `/bulk-post/${LOCATION_ID}`, // putaway whole QR
        method: "POST",
      }),
      invalidatesTags: ["inbound_putaway", "Package"],
    }),

    postContainerQualityInspection: builder.mutation<
      PackageApiResponse,
      { id: number; body: ContainerQualityInspectionArray }
    >({
      query: ({ id, body }) => ({
        url: `/${id}/container-quality-inspection`, // quality 5 questions post
        method: "POST",
        body,
      }),
      invalidatesTags: ["Package"],
    }),

    patchBinning: builder.mutation<unknown, number>({
      query: (ITEM_ID) => ({
        url: `/scan-item/${ITEM_ID}`, // putaway dialog pasting
        method: "PATCH",
      }),
      invalidatesTags: ["inbound_putaway", "Package"],
    }),

    patchScanItemsBulk: builder.mutation<unknown, BulkScanRequest>({
      query: (body) => ({
        url: `/scan-items/bulk`, // putaway whole table select
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["inbound_putaway", "Package"],
    }),

    getSKuLocationList: builder.query<BinLocationResponse, BinLocationArgs>({
      query: (ITEM_ID) => `/variant-locations/${ITEM_ID}`, //putaway dialog storage location
    }),

    postItemQualityInspection: builder.mutation<
      PackageApiResponse,
      { id: number; body: ItemsSchema[] }
    >({
      query: ({ id, body }) => ({
        url: `/${id}/item-quality-inspection`, //  item damaged/pass post
        method: "POST",
        body,
      }),
      invalidatesTags: ["Package"],
    }),
    patchCreateGrn: builder.mutation<GrnResponse, { ITEM_ID: number }>({
      query: ({ ITEM_ID }) => ({
        url: `${ITEM_ID}/create-grn`, // create GRN
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetInboundOrdersQuery,
  useGetPutawayItemsByIdQuery,
  usePostPutAwayItemsMutation,
  useGetPackageOrderByIdQuery,
  usePostContainerQualityInspectionMutation,
  usePatchBinningMutation,
  useGetSKuLocationListQuery,
  usePatchScanItemsBulkMutation,
  usePostItemQualityInspectionMutation,
  usePatchCreateGrnMutation,
} = inboundApi;
