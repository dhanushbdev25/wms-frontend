import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

export const attachmentsApi = createApi({
  reducerPath: "attachmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/api/attachments/`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user.userInfo.token;
      const OUID = state.user.defaultOU;

      if (token) headers.set("Authorization", `Bearer ${token}`);
      if (OUID) headers.set("OUID", OUID);

      return headers;
    },
  }),
  tagTypes: ["Attachments"],
  endpoints: (builder) => ({
    uploadAttachment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Attachments"],
    }),

    listAttachments: builder.query<
      any,
      { refId: string; pageSection?: string }
    >({
      query: ({ refId, pageSection }) => {
        const qs = pageSection ? `?pageSection=${pageSection}` : "";
        return `list/${refId}${qs}`;
      },
      providesTags: ["Attachments"],
    }),
  }),
});

export const {
  useUploadAttachmentMutation,
  useListAttachmentsQuery,
  useLazyListAttachmentsQuery,
} = attachmentsApi;