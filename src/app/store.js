/** @format */

import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import apiSlice from "../features/Api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, logger),
  // middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(logger),
});
