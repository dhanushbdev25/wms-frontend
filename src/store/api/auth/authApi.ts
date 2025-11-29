import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setSelectWareHouse, setUserDetails } from "../../reducers/userInfo";
import { IGenericResponse } from "../types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/auth/`,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<IGenericResponse, Record<string, unknown>>({
      query(data) {
        return {
          url: "login",
          method: "post",
          body: data,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          dispatch(setUserDetails(data.data));
          const newWareHouseId = data?.data?.userWarehouseMapping.filter((data : any)=> data.ISDEFAULT )      
          dispatch(setSelectWareHouse(newWareHouseId[0]?.WAREHOUSE?.WAREHOUSE_ID));
        } catch (error) {
          console.error("Error occurred while logging in:", error);
        }
      },
    }),
    forgotPassword: builder.mutation<IGenericResponse, { EMAIL: string }>({
      query: ({ EMAIL }) => ({
        url: "forgotPassword",
        method: "POST",
        body: { EMAIL },
      }),
    }),
    resetPassword: builder.mutation<
      IGenericResponse,
      { PASSWORD: string; TOKEN?: string }
    >({
      query: ({ PASSWORD, TOKEN }) => ({
        url: "resetPassword",
        method: "POST",
        body: { PASSWORD },
        headers: { Authorization: `x-reset-token ${TOKEN}` },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
