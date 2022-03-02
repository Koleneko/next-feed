import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Link as ChakraLink,
  ButtonGroup,
  Button,
  Textarea,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Post } from "types/post";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useAppSelector } from "hooks/redux.hooks";
import useMounted from "hooks/useMounted";
import CommentComponent from "@/components/Comment";
import { Comment } from "types/post";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useGetCommentsByPostIdQuery } from "store/features/api/comments";

const RedactPost = dynamic(() => import("../../../components/postRedact"));

interface PostPageProps {
  post: Post;
}

const PostPage: React.FC<PostPageProps> = ({ post }) => {
  const [isRedactMode, setIsRedactMode] = useState<boolean>(false);
  const mounted = useMounted();
  const router = useRouter();

  const toast = useToast();
  const userId = useAppSelector((state) => state.user.userInfo._id);
  const userToken = useAppSelector((state) => state.user.userInfo.token);

  const handlePostDelete = () => {
    axios
      .delete(process.env.NEXT_PUBLIC_API + `posts/${post._id}`, {
        headers: {
          Authorization: userToken,
        },
      })
      .then(() => {
        router.push("/");
      })
      .catch((e) =>
        toast({
          status: "error",
          description: e.message ? e.message : "Ошибка при удалении поста",
        })
      );
  };

  const handleCommentSend = (data: any) => console.log(data);

  return (
    <Box alignSelf={"center"}>
      <Stack alignItems={"center"}>
        <Heading>{post.title}</Heading>
        <Text>
          Created by{" "}
          <Link href={`/users/${post.user.username}`} passHref>
            <ChakraLink>{post.user.username}</ChakraLink>
          </Link>
        </Text>
        <ButtonGroup>
          {mounted && userId === post.user._id && (
            <>
              <Button
                colorScheme="messenger"
                onClick={() => setIsRedactMode((prev) => !prev)}
              >
                Редактировать
              </Button>
              <Button colorScheme="red" onClick={() => handlePostDelete()}>
                Удалить
              </Button>
            </>
          )}
        </ButtonGroup>
        {isRedactMode ? (
          <RedactPost post={post} userId={post.user._id} />
        ) : (
          <Container minW={[null, "container.md"]}>
            <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
              {post.text}
            </ReactMarkdown>
            <Divider mt={5} />
            <Text fontWeight={"semibold"} fontSize={"2xl"}>
              Комментарии
            </Text>
            <CommentComponent postId={post._id} />
          </Container>
        )}
      </Stack>
    </Box>
  );
};

export type ApiPostsReq = {
  total: number;
  items: Post[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get<ApiPostsReq>(
    process.env.NEXT_PUBLIC_API + "posts"
  );
  const posts = res.data.items;
  const paths = posts.map((obj) => {
    return { params: { username: obj.user.username, post: obj.slug } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async (
  context
) => {
  const params = context.params!;

  if (!params) {
    return { notFound: true };
  }

  const res = await axios.get<Post>(
    process.env.NEXT_PUBLIC_API + `posts/by-slug?slug=${params.post}`
  );

  const post = res.data!;

  // const { data: comments } = await axios.get<Comment[]>(
  //   process.env.NEXT_PUBLIC_API + `comments/post/${post._id}`
  // );

  return {
    props: { post },
    revalidate: 10,
  };
};

export default PostPage;
