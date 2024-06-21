/** @format */

import apiSlice from "../Api/apiSlice";

const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: "/chats",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chat"],
    }),
    getMyChat: builder.query({
      query: (props) => ({
        url: `/chats/myChat/${props}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),
  }),
});

export const { useGetMyChatQuery, useCreateChatMutation } = chatApi;
