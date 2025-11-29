import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { RootState } from "../../store";
import {
  AllocationsResponse,
  CreateAllocationSchema,
  createWayBillShcema,
  DispatchResponseType,
  OrderItemResponse,
  OrderItemsResponse,
  OrderNewItemshema,
  OrderResponse,
  PickupResponse,
  VinAllocationSchema,
} from "../outbound-validators/outbound.validator";
import { OutboundApiResponse } from "../types";

export const outboundApi = createApi({
  reducerPath: "outboundApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/outbound`,
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
  tagTypes: ["Outbound", "getAllOrder", "DispatchItems", "PickUpItems","statistic"],
  endpoints: (builder) => ({
    getOutboundOrders: builder.query<
      OutboundApiResponse<OrderResponse[]>, //index page outbound order
      any
    >({
      query:({ statuses  }) => {
        const params = new URLSearchParams();
        if (statuses) params.append("statuses", statuses);
        return `/?${params.toString()}`;
      },
      providesTags: ["Outbound"],
    }),

    // --------------------------------------allocation page ----------------------------------
    getAllOrderAllocation: builder.query<AllocationsResponse, number>({
      query: (id) => `/orders/${id}/allocations`, //allocation page accoedion
    }),

    getAllOrderItems: builder.query<OrderItemsResponse, number>({
      query: (orderId) => `/order-items/${orderId}`, //create new allocation dialog
      providesTags: ["getAllOrder"],
    }),

    getOrderByID: builder.query<OrderItemResponse, number>({
      query: (orderid) => `/${orderid}`, //view - statistics box
      providesTags:["statistic"]
    }),

    getOrderALlocation: builder.query<OrderNewItemshema, string>({
      query: (allocationID) => `orderAllocations/${allocationID}`, // updateallocation api allocation page
    }),

    patchManageOrderAllocation: builder.mutation<
      unknown,
      CreateAllocationSchema
    >({
      //create or update allocation in allocation page
      query: (body) => ({
        url: `/allocations`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["getAllOrder","statistic"],
    }),
    //---------------------------------dispatch page -----------------------------------------

    getDispatchedItems: builder.query<DispatchResponseType, number>({
      query: (id) => `/dispatched-items/${id}`,
      providesTags: ["DispatchItems"],
    }),

    postCreateWayBill: builder.mutation<unknown, createWayBillShcema>({
      query: (body) => ({
        url: `/generate-waybill`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["DispatchItems" ,"statistic"],
    }),
    //-------------------------------------pickup items------------------------------------------
    getPickupItems: builder.query<PickupResponse, number>({
      query: (id) => `/pickup-items/${id}`,
      providesTags: ["PickUpItems"],
    }),

    postPickUpItems: builder.mutation<unknown, VinAllocationSchema>({
      query: (body) => ({
        url: `/pickUpItems`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["PickUpItems","statistic"],
    }),
  }),
});

export const {
  //-------------allocation page ------------------------
  useGetOutboundOrdersQuery,
  useGetAllOrderAllocationQuery,
  useGetAllOrderItemsQuery,
  useGetOrderByIDQuery,
  usePatchManageOrderAllocationMutation,
  useGetOrderALlocationQuery,
  //---------------dispatch page -----------------------
  useGetDispatchedItemsQuery,
  usePostCreateWayBillMutation,
  //----------------ickupItetemPage------------------------
  usePostPickUpItemsMutation,
  useGetPickupItemsQuery,
} = outboundApi;
