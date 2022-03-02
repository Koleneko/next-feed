import React from "react";
import {
  Box,
  Divider,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import UserProfilePost from "@/components/UserProfilePost";
import { CommentRender } from "@/components/Comment";
import { Comment, Post } from "types/post";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import axios from "axios";

interface UserProfileData {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  posts: {
    total: number;
    items: Post[];
  };
  comments: {
    total: number;
    items: Comment[];
  };
}

interface UserProfilePageProps {
  userInfo: UserProfileData;
}

const UserProfile: React.FC<UserProfilePageProps> = ({
  userInfo,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  return (
    <VStack overflow="hidden" mt={4} spacing={5} w="100%">
      <Box alignContent={"center"} mb={4}>
        <Text as="h1" fontSize="5xl" fontWeight={"bold"} align={"center"}>
          {userInfo.username}
        </Text>
        <Text>На сайте с {userInfo.createdAt}</Text>
      </Box>
      <Divider />
      <Tabs pl={5} isLazy isFitted align={"start"} width={"100%"}>
        <TabList>
          <Tab>Записи</Tab>
          <Tab>Комментарии</Tab>
        </TabList>
        <TabPanels>
          <TabPanel width={"100%"} px={0}>
            <Stack>
              {userInfo.posts.items.length ? (
                userInfo.posts.items.map((post) => (
                  <UserProfilePost {...post} key={post._id} />
                ))
              ) : (
                <Text size="md" fontWeight={"bold"}>
                  Пользователь не опубликовал ни одной записи
                </Text>
              )}
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack>
              {userInfo.comments.items.length ? (
                userInfo.comments.items.map((comment) => (
                  <CommentRender
                    key={comment._id}
                    commentText={comment.text}
                    username={comment.user.username}
                    isOwner={false}
                    createdAt={comment.createdAt}
                    id={comment._id}
                  />
                ))
              ) : (
                <Text size="md" fontWeight={"bold"}>
                  Пользователь не оставил ни одного комментария
                </Text>
              )}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export interface ApiUsersReq {
  total: number;
  items: UserProfileData[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get<ApiUsersReq>(
    process.env.NEXT_PUBLIC_API + "users"
  );
  const users = res.data.items;
  const paths = users.map((obj) => {
    return { params: { username: obj.username } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<UserProfilePageProps> = async (
  context
) => {
  const params = context.params!;

  if (!params) {
    return {
      notFound: true,
    };
  }
  const res = await axios.get<UserProfileData>(
    process.env.NEXT_PUBLIC_API + `users/by_username/${params.username}`
  );
  const userInfo = res.data!;

  return {
    props: { userInfo } as UserProfilePageProps,
    revalidate: 10,
  };
};

export default UserProfile;
