import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";
import { RootState } from "../../store";

export const warrantyApi = createApi({
  reducerPath: "warrantyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/warranty/`,
    prepareHeaders: async (headers, { getState }) => {
      const userState = (getState() as RootState).user;
      const state = getState() as RootState;
      const token = userState.userInfo.token;
      const OUID = state.user.defaultOU;

      //   const USERID = state.user.userInfo.userInfo.USERID
      //   const wareHouseID = userState.selectWareHouse;
      //   const ROLEID = userState.selectedRole
      //     ? userState.selectedRole
      //     : userState.userInfo.defaultRole.ROLEID;

      if (token && OUID) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("OUID", OUID);
        // headers.set("WAREHOUSE_ID", wareHouseID);
        // headers.set("ROLEID", ROLEID);
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
  //   refetchOnMountOrArgChange: true,
  tagTypes: ["allWarranty" ,"warrantyById"],
  endpoints: (builder) => ({
    getAllWarranty: builder.query<any, any>({
      query: () => `get-warranties-list`,
      providesTags: ["allWarranty"],
    }),
    getAllWarrantyById: builder.query<any, any>({
      query: (id) => `get-warranty/${id}`,
      providesTags:["warrantyById"]
    }),
    getSkuList: builder.query<any, any>({
      query: () => `get-sku-list`,
    }),
    getSpareStocks :builder.query<any,any>({
      query:()=>`get-spare-stocks-dropdown`,
    }),
    getDealerCode :builder.query<any,any>({
      query:()=>`get-dealer-location-dropdown`
    }),
    postAddSku: builder.mutation<any, any>({
      query: (body) => ({
        url: `add-job-items`,
        method: "POST",
        body: body,
      }),
      invalidatesTags:["warrantyById"],
    }),
    postCreateNewWarranty: builder.mutation<any, any>({
      query: (body) => ({
        url: `create-warranty`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["allWarranty","warrantyById"],
    }),
    postUpdateWarranty: builder.mutation<any, any>({
      query: (body) => ({
        url: `approve-warranty`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["allWarranty"],
    }),

    // postCreateJobCard: builder.mutation<any, any>({
    //   query: (body) => ({
    //     url: `/create-job-cards`,
    //     method: "POST",
    //     body: body,
    //   }),
    // }),
  }),
  refetchOnMountOrArgChange:true
});

export const {
  useGetAllWarrantyQuery,
  useGetAllWarrantyByIdQuery,
  useGetSkuListQuery,
  useLazyGetSpareStocksQuery,
  usePostCreateNewWarrantyMutation,
  usePostUpdateWarrantyMutation,
  usePostAddSkuMutation,
  useGetDealerCodeQuery,
  // usePostCreateJobCardMutation,
} = warrantyApi;
