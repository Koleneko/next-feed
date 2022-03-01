import { createAsyncThunk } from "@reduxjs/toolkit";
import { Post } from "types/post";
import postCreationService, { IPostData } from "services/postCreation.service";
import { IPostInputs } from "pages/create";
import { AppStore, RootState } from "store/index";

type AsyncThunkConfig = {
  state: RootState;
};

export const createPost = createAsyncThunk<
  Promise<any>,
  IPostInputs,
  AsyncThunkConfig
>("post/create", async (postInputs, thunkApi) => {
  const userToken = thunkApi.getState().user.userInfo.token;

  const postData = {
    ...postInputs,
  };
  const res = await postCreationService.createPost(postData, userToken);
});

export const uploadImage = createAsyncThunk(
  "post/uploadImage",
  async (img: FormData) => {
    const res = await postCreationService.uploadImage(img);
    return res;
  }
);
