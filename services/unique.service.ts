import axios from "axios";
import { slugifyWithCounter } from "@sindresorhus/slugify";

// const customInstance = axios.create({ baseURL: process.env.API });

export type UniquenessCheckArgs = { email: string } | { username: string };

export const checkTokenUniqueness = async (
  token: UniquenessCheckArgs
): Promise<boolean> => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API + "unique", {
      params: token,
    });
    if (res.status === 200) return true;
  } catch (e) {
    return false;
  }

  return false;
};

const slugify = slugifyWithCounter();

export const checkSlugUniqueness = async (slug: string): Promise<string> => {
  const slugToSend = slugify(slug);
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API + "unique", {
      params: { slug: slugToSend },
    });
    if (res.status === 200) {
      slugify.reset();
      return slugToSend;
    }
  } catch (e) {
    checkSlugUniqueness(slug);
  }
  return slugToSend;
};
