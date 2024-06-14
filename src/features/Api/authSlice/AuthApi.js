/** @format */

import apiSlice from "../apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      providesTags: ["users"],
    }),
    getAllUser: builder.query({
      query: ({ token }) => ({
        url: "/users",
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      }),
      providesTags: ["users"],
    }),
  }),
});

export const { useLoginMutation, useGetAllUserQuery } = authApi;
