import axios from "axios";

// const customInstance = axios.create({ baseURL: process.env.API });

export const checkUsernameUniqueness = async (username: string) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API + "unique", {
      params: {
        username,
      },
    });
    if (res.status === 200) return true;
  } catch (e) {
    return false;
  }
};
export const checkEmailUniqueness = async (email: string) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API + "unique", {
      params: {
        email,
      },
    });
    if (res.status === 200) return true;
  } catch (e) {
    return false;
  }
};
