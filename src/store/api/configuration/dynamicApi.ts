import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";

import { RootState } from "../../store";

interface GenericResponse<T = unknown> {
  data: T;
  message?: string;
}

/**
 * Use Record<string, unknown> for params/body when shape is unknown.
 * Replace 'unknown' with concrete types for stronger typing where possible.
 */
export const dynamicApi = createApi({
  reducerPath: "dynamicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_FORM_BUILDER_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user.userInfo?.token;
      const OUID = state.user.defaultOU;

      if (token && OUID) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("OUID", OUID);
      } else {
        // explicitly mark the promise as intentionally ignored to satisfy linter
        void Swal.fire({
          title: "API Error",
          text: "API headers missing",
          icon: "error",
        });
      }

      return headers;
    },
  }),
  tagTypes: ["dynamic"],
  endpoints: (builder) => ({
    /**
     * GET - returns GenericResponse<unknown> by default.
     * Change GenericResponse<YourType> to the real return type when you know it.
     */
    getData: builder.query<
      GenericResponse<unknown>,
      { url: string; params?: Record<string, unknown> }
    >({
      query: ({ url, params }) => ({
        url,
        method: "GET",
        params,
      }),
      providesTags: ["dynamic"],
    }),

    /**
     * POST - body typed as unknown; replace with a concrete type when available.
     */
    postData: builder.mutation<
      GenericResponse<unknown>,
      { url: string; body?: Record<string, unknown> }
    >({
      query: ({ url, body }) => ({
        url,
        method: "POST",
        body,
      }),
      invalidatesTags: ["dynamic"],
    }),

    putData: builder.mutation<
      GenericResponse<unknown>,
      { url: string; body?: Record<string, unknown> }
    >({
      query: ({ url, body }) => ({
        url,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["dynamic"],
    }),

    deleteData: builder.mutation<GenericResponse<unknown>, { url: string }>({
      query: ({ url }) => ({
        url,
        method: "DELETE",
      }),
      invalidatesTags: ["dynamic"],
    }),
  }),
});

export const {
  useGetDataQuery,
  usePostDataMutation,
  usePutDataMutation,
  useDeleteDataMutation,
} = dynamicApi;
