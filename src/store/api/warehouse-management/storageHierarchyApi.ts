import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { StorageHierarchyData } from "../../../types/storage-hierarchy";
import { RootState } from "../../store";
import { ApiResponse, IGenericResponse } from "../types";
import {
  GetStorageHierarchyArg,
  GetStorageHierarchyLocationArg,
  ManageStorageHierarchyArg,
} from "../warehouse-management-validators/warehouse.validator";

export const storageHierarchyApi = createApi({
  reducerPath: "storageHierarchyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/storage-management/hierarchy`,
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
  // refetchOnMountOrArgChange: true,
  tagTypes: ["StorageHierarchy"],
  endpoints: (builder) => ({
    getStorageHierarchy: builder.query<
      ApiResponse<StorageHierarchyData[]>,
      GetStorageHierarchyArg
    >({
      query: (id) => `/${id}`,

      providesTags: ["StorageHierarchy"],
    }),
    getStorageHierarchyLocation: builder.query<
      ApiResponse<StorageHierarchyData[]>,
      GetStorageHierarchyLocationArg
    >({
      query: ({ id, hierarchyLevel }) => ({
        url: `/by-hierarchy/${id}`,
        params: { hierarchyLevel },
      }),
    }),
    manageStorageHierarchy: builder.mutation<
      IGenericResponse,
      ManageStorageHierarchyArg
    >({
      query: ({ id, action, ...body }) =>
        action === "update"
          ? {
              url: `/${id}`,
              method: "PATCH",
              body,
            }
          : {
              url: `/${id}`,
              method: "POST",
              body,
            },
      invalidatesTags: ["StorageHierarchy"],
    }),
  }),
});

export const {
  useGetStorageHierarchyQuery,
  useManageStorageHierarchyMutation,
  useLazyGetStorageHierarchyLocationQuery,
} = storageHierarchyApi;
