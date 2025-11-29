import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { RootState } from "../../store";

export const configurationAPI = createApi({
  reducerPath: "configuration",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/ou`,
    prepareHeaders: async (headers, { getState }) => {
      const userState = (getState() as RootState).user;

      const token = userState.userInfo.token;
      const OUID = userState.defaultOU;

      if (token && OUID) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("OUID", OUID);
      } else {
        void Swal.fire({
          text: "API headers missing",
          icon: "error",
          title: "API Error",
        });
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOUList: builder.query<void, void>({
      query() {
        return {
          url: "/getUserOuMapping",
          method: "get",
        };
      },
    }),

    getWareHouseList: builder.query<any, any>({
      query() {
        return {
          url: "/getAllMappedWarehouses",
          method: "get",
        };
      },
    }),
  }),
});

export const { useGetOUListQuery, useGetWareHouseListQuery } = configurationAPI;
