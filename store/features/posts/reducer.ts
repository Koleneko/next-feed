import { createSlice } from "@reduxjs/toolkit";
import { createPost, uploadImage } from "store/features/posts/actions";
import toast from "utils/chakra-components/toast";

type InitialState = {
  status: "success" | "uploading" | "idle" | "error";
  imageUpload: "success" | "uploading" | "idle" | "error";
  imagePath: string;
};

const initialState: InitialState = {
  status: "idle",
  imageUpload: "idle",
  imagePath: "",
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.status = "uploading";
      })
      .addCase(createPost.fulfilled, (state) => {
        state.status = "success";
        state.status = "idle";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(uploadImage.pending, (state) => {
        state.imageUpload = "uploading";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.imagePath = action.payload.url;
        state.imageUpload = "success";
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.imageUpload = "error";
        toast({
          title: "Ошибка при загрузке изображения",
          status: "error",
        });
      });
  },
});
