/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://192.168.31.82:8000/api/v1/`,
  }),
  endpoints: (builder) => ({}),
});

export default apiSlice;
