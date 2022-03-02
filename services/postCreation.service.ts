import axios from "axios";
import { Post } from "types/post";
import { IPostInputs } from "pages/create";
import { UserInfo } from "types/user";

export interface IPostData extends IPostInputs {
  userId: UserInfo["_id"];
}

const instance = axios.create();

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("userToken");
//   console.log(token);
//   if (config.headers) config.headers.Authorization = token ?? "";
//   return config;
// });

const createPost = async (postData: IPostInputs, token: string) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API + "posts",
    postData,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};

export const updatePost = async (
  postData: IPostInputs,
  postId: string,
  token: string
) => {
  let res;
  try {
    res = await axios.patch(
      process.env.NEXT_PUBLIC_API + `posts/${postId}`,
      postData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (e) {}

  console.log(res);
  return res?.status === 202;
};

const uploadImage = async (file: any) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API + "posts/upload",
    file,
    {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    }
  );

  console.log(res.data);

  return res.data;
};

const postCreationService = {
  createPost,
  uploadImage,
};

export default postCreationService;
