import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Post = { title: string; text: string };

export type Posts = Array<Post>;

const initialState: Posts = [];

export const postsSlice = createSlice({
  reducers: {
    HYDRATION,
  },
  name: "posts",
  initialState,
});
