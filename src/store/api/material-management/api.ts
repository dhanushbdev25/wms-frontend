import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { Material, MaterialItem } from "../../../types/material";
import { RootState } from "../../store";
import { ManageMaterialArg } from "../meterial-management-validators/materialform.validator";
import { ApiResponse, IGenericResponse } from "../types";

export const materialManagementApi = createApi({
  reducerPath: "materialManagementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/materials`,
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
  // refetchOnMountOrArgChange: true,
  tagTypes: ["Materials"],
  endpoints: (builder) => ({
    getAllMaterials: builder.query<ApiResponse<MaterialItem[]>, void>({
      query: () => `/`,
      providesTags: ["Materials"],
    }),
    getMaterialDetails: builder.query<ApiResponse<Material>, number | string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Materials", id }],
    }),
    manageMaterial: builder.mutation<IGenericResponse, ManageMaterialArg>({
      query: ({ id, ...body }) =>
        id
          ? {
              url: `/${id}`,
              method: "PATCH",
              body,
            }
          : {
              url: "/",
              method: "POST",
              body,
            },
      invalidatesTags: ["Materials"],
    }),
  }),
});

export const {
  useGetAllMaterialsQuery,
  useGetMaterialDetailsQuery,
  useLazyGetMaterialDetailsQuery,
  useManageMaterialMutation,
} = materialManagementApi;
