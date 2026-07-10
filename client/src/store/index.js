import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import matchReducer from "./slices/matchSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchReducer,
  },
});
