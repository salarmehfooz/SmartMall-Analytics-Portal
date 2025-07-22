import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import storeReducer from "../redux/storeSlice";
import walkInLogReducer from "../redux/walkInLogSlice";
import telcoTrendReducer from "../redux/telcoTrendSlice";
import recommendationReducer from "../redux/recommendationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stores: storeReducer,
    walkInLogs: walkInLogReducer,
    telcoTrends: telcoTrendReducer,
    recommendations: recommendationReducer,
  },
});
