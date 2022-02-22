import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "types/user";
import { login, logout, registerUser } from "store/features/user/actions";
import { toast } from "react-hot-toast";
import showToast from "utils/chakra-components/toast";

type InitialState = {
  userInfo: UserInfo;
  loading: "idle" | "loading" | "success" | "error";
};

const initialState: InitialState = {
  userInfo: {} as UserInfo,
  loading: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.loading = "success";
      showToast({
        title: "Успешно вошли 👍",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    });
    builder.addCase(login.pending, (state) => {
      state.loading = "loading";
    });
    builder.addCase(login.rejected, (state, action) => {
      console.log(action);
      state.loading = "error";
      showToast({
        title: "Неверное имя пользователя или пароль 🤔",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    });
    builder.addCase(registerUser.pending, (state) => {
      state.loading = "loading";
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.loading = "success";
      showToast({
        title: "Аккаунт создан 🤠",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.loading = "error";
      showToast({
        title: "Ошибка при регистрации 😭",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    });
    builder.addCase(logout, (state) => {
      state.userInfo = {} as UserInfo;
      showToast({
        title: "Прощайте 😭",
        variant: "subtle",
        duration: 1500,
        isClosable: true,
      });
    });
  },
});
