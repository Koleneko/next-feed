import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Comment, Post } from "types/post";
import { RootState } from "store/index";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.userInfo.token;
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  tagTypes: ["Comments"],

  endpoints: (builder) => ({
    getCommentsByPostId: builder.query<Comment[], string>({
      query: (postId) => `comments/post/${postId}`,
      providesTags: ["Comments"],
    }),
    createComment: builder.mutation<Comment, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `comments`,
        method: "POST",
        body: {
          text,
          postId: id,
        },
      }),
      invalidatesTags: ["Comments"],
    }),
    updateComment: builder.mutation<Comment, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `comments/${id}`,
        method: "PATCH",
        body: {
          text,
        },
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteComment: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsByPostIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
