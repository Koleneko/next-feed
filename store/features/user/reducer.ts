import { createAction, createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "types/user";
import { HYDRATE } from "next-redux-wrapper";
import { login, logout, registerUser } from "store/features/user/actions";
import showToast from "utils/chakra-components/toast";
import { RootState } from "store/index";

type InitialState = {
  userInfo: UserInfo;
  loading: "idle" | "loading" | "success" | "error";
};

const initialState: InitialState = {
  userInfo: {} as UserInfo,
  loading: "idle",
};

const hydrate = createAction<RootState>(HYDRATE);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.loading = "success";
        showToast({
          title: "Успешно вошли 👍",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      })
      .addCase(login.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action);
        state.loading = "error";
        showToast({
          title: "Неверное имя пользователя или пароль 🤔",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.loading = "success";
        showToast({
          title: "Аккаунт создан 🤠",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = "error";
        showToast({
          title: "Ошибка при регистрации 😭",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      })
      .addCase(logout, (state) => {
        state.userInfo = {} as UserInfo;
        showToast({
          title: "Прощайте 😭",
          variant: "subtle",
          duration: 1500,
          isClosable: true,
        });
      })
      .addCase(hydrate, (state, action) => {
        if (action.payload && action.payload.user)
          state.userInfo = action.payload.user.userInfo ?? ({} as UserInfo);
      });
  },
});
