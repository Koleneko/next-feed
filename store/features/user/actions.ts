import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginData, RegisterData, UserInfo } from "types/user";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginData) => {
    const res = await axios.post<LoginData>(
      process.env.NEXT_PUBLIC_API + "auth/login",
      loginData
    );

    return res.data as UserInfo;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData: RegisterData) => {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_API + "auth/register",
      registerData
    );
    return res.data as UserInfo;
  }
);
export const logout = createAction("auth/logout");
