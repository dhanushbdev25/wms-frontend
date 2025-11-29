import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";
import { RootState } from "../../store";

export const onholdItemsApi = createApi({
  reducerPath: "onholdItemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/on-hold`,
    prepareHeaders: async(headers, { getState }) => {
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
  tagTypes: [""],

  endpoints: (builder) => ({
    //--------------------
    getAllOnHoldItems: builder.query<any, void>({
      query: () => `/`,
    }),
    
    getAllOnHoldItemsById: builder.query<any, number>({
      query: (id) => `/${id}`,
    }),
    //-----------------
    patchPutAwayOnHoldItems: builder.mutation<any, any>({
      query: (body) => ({
        url: `/putaway`,
        method: "PATCH",
        body,
      }),
    }),
    patchScrapOnHoldItems: builder.mutation<any, any>({
      query: (body) => ({
        url: `/scrap`,
        method: "PATCH",
        body,
      }),
    }),
    //----------------
  }),
});

export const {
  useGetAllOnHoldItemsQuery,
  useGetAllOnHoldItemsByIdQuery,
  usePatchPutAwayOnHoldItemsMutation,
  usePatchScrapOnHoldItemsMutation,
} = onholdItemsApi;
