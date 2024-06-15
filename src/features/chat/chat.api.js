/** @format */

import apiSlice from "../Api/apiSlice";

const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendChat: builder.mutation({
      query: (data) => ({
        url: "/chats",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chat"],
    }),
    getChat: builder.query({
      query: (props) => ({
        url: `/chats?${props && props}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),
    myMessages: builder.query({
      query: ({ senderId, receiverId }) => ({
        url: `/chats/myMessages?senderId=${senderId}&receiverId=${receiverId}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),
  }),
});

export const { useGetChatQuery, useSendChatMutation, useMyMessagesQuery } =
  chatApi;
