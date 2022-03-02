import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { userSlice } from "store/features/user/reducer";
import { createWrapper } from "next-redux-wrapper";
import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from "next-redux-cookie-wrapper";
import { postSlice } from "store/features/posts/reducer";
import { commentsApi } from "store/features/api/comments";

export const store = wrapMakeStore(() =>
  configureStore({
    reducer: {
      [commentsApi.reducerPath]: commentsApi.reducer,
      user: userSlice.reducer,
      post: postSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(commentsApi.middleware)
        .prepend(
          nextReduxCookieMiddleware({
            subtrees: [`${userSlice.name}.userInfo`],
          })
        ),
  })
);
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
