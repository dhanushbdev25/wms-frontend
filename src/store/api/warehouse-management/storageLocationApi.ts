import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import {
  LocationOverview,
  LocationSkuDetails,
  StorageLocation,
  SubLocations,
} from "../../../types/storage-location";
import { RootState } from "../../store";
import { ApiResponse, IGenericResponse } from "../types";
import {
  LocationIdArg,
  ManageLocationArg,
} from "../warehouse-management-validators/warehouse.validator";

export const storageLocationApi = createApi({
  reducerPath: "storageLocationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/storage-management`,
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
  tagTypes: [
    "StorageLocation",
    "LocationOverview",
    "LocationSkuDetails",
    "SubLocations",
  ],

  endpoints: (builder) => ({
    getStorageLocations: builder.query<
      ApiResponse<StorageLocation[]>,
      LocationIdArg
    >({
      query: (id) => `/location/locations/children/${id}`,
      providesTags: ["StorageLocation"],
    }),

    manageStorageLocation: builder.mutation<
      IGenericResponse,
      ManageLocationArg
    >({
      query: ({ id, ...body }) => {
        if ("parentId" in body || !("name" in body && "code" in body)) {
          return {
            url: `/location/warehouses/${id}`, // warehouseId
            method: "POST",
            body,
          };
        }
        return {
          url: `/location/${id}`, // locationId
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["StorageLocation"],
    }),

    getLocationOverview: builder.query<
      ApiResponse<LocationOverview>,
      LocationIdArg
    >({
      query: (id) => `/location/locations/overview/${id}`,
      providesTags: ["LocationOverview"],
    }),

    getLocationSkuDetails: builder.query<
      ApiResponse<LocationSkuDetails[]>,
      LocationIdArg
    >({
      query: (id) => `variant/location/${id}`,
      providesTags: ["LocationSkuDetails"],
    }),

    getSubLocations: builder.query<ApiResponse<SubLocations[]>, LocationIdArg>({
      query: (id) => `hierarchy/sublocations/${id}`,
      providesTags: ["SubLocations"],
    }),
  }),
});

export const {
  useGetStorageLocationsQuery,
  useManageStorageLocationMutation,
  useGetLocationOverviewQuery,
  useGetLocationSkuDetailsQuery,
  useGetSubLocationsQuery,
} = storageLocationApi;
