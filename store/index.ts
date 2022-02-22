import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { userSlice } from "store/features/user/reducer";
import { createWrapper } from "next-redux-wrapper";

// const createStore = (preloadedState) => {
//   return configureStore({
//     reducer: {},
//   });
// };

export const store = () =>
  configureStore({
    reducer: {
      user: userSlice.reducer,
    },
  });
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(store);
