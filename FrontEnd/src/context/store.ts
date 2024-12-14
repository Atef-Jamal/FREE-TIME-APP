import { configureStore } from "@reduxjs/toolkit";
import StateManegerSlice from "./StateManeger";

const store = configureStore({
  reducer: { stateManeger: StateManegerSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
