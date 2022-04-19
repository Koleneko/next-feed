import Head from "next/head";
import { Box, Stack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import axios from "axios";
import { Post } from "types/post";
import UserProfilePost from "@/components/UserProfilePost";
import React from "react";

interface HomeProps {
  posts: Post[];
}

const Home: React.FC<HomeProps> = ({ posts }): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Feed blog</title>
        <meta name="description" content="Blog for everyone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box mx={[null, "10%"]}>
        <Stack>
          {posts.map((post) => (
            <UserProfilePost {...post} key={post._id} />
          ))}
        </Stack>
      </Box>
    </div>
  );
};

export type PostApiReq = {
  total: number;
  items: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get<PostApiReq>(
    process.env.NEXT_PUBLIC_API + "posts"
  );
  const posts = res.data.items;

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
};

export default Home;
