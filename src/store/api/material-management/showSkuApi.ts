import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { MaterialItem, SkuDetails } from "../../../types/sku";
import { RootState } from "../../store";
import { ApiResponse, IGenericResponse, IPatchSkuDetails } from "../types";

export const showSkuApi = createApi({
  reducerPath: "showSkuApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/materials/`,
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
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getSkuDetails: builder.query<ApiResponse<MaterialItem[]>, void>({
      query: () => `material-variants`,
    }),
    getSkuDetailsById: builder.query<ApiResponse<SkuDetails>, number>({
      query: (id) => `variant/${id}`,
    }),

    patchSkuDetailsById: builder.mutation<
      IGenericResponse,
      { id: number; body: IPatchSkuDetails }
    >({
      query: ({ id, body }) => ({
        url: `update-variant/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetSkuDetailsQuery,
  useGetSkuDetailsByIdQuery,
  usePatchSkuDetailsByIdMutation,
} = showSkuApi;
