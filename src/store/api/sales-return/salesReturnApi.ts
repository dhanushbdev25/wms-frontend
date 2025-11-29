import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";
import { RootState } from "../../store";

export const SalesReturnApi = createApi({
  reducerPath: "SalesReturnApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/sales-return`,
    prepareHeaders:async (headers, { getState }) => {
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
  tagTypes: ["sales-return"],

  endpoints: (builder) => ({
    getFetchAllReturn: builder.query<any, any>({
      query: () => `/list`,
      providesTags:["sales-return"]
    }),
    getReturnDetailBySRN: builder.query<any, any>({
      query: (srn_no) => `/details/${srn_no}`,
    }),

    getFetchScaner: builder.query<any, any>({
      query: (variant_value) => `/scan-variant/${variant_value}`,
    }),

    postCreateSalesReturn: builder.mutation<any, any>({
      query: (body) => ({
        url: `/create-sales-return`,
        method: "POST",
        body: body,
      }),
      invalidatesTags : ["sales-return"]
    }),
  }),
});

export const {
  useGetFetchAllReturnQuery,
  useGetReturnDetailBySRNQuery,

  useLazyGetFetchScanerQuery,
  usePostCreateSalesReturnMutation,
} = SalesReturnApi;
