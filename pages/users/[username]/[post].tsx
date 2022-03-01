import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Link as ChakraLink,
  ButtonGroup,
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Spinner,
  Flex,
  Tooltip,
  Textarea,
  useToast,
  useClipboard,
} from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Post } from "types/post";
import axios from "axios";
import React, { useState } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { AddIcon, CopyIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "firebase/app";
import { IPostInputs } from "pages/create";
import { useAppSelector } from "hooks/redux.hooks";
import { updatePost } from "services/postCreation.service";
import useMounted from "hooks/useMounted";
import CommentComponent from "@/components/Comment";
import { Comment } from "types/post";
import { log } from "util";

interface PostPageProps {
  post: Post;
  comments: Comment[];
}

const PostPage: React.FC<PostPageProps> = ({ post, comments }) => {
  const [isRedactMode, setIsRedactMode] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  const mounted = useMounted();
  const userId = useAppSelector((state) => state.user.userInfo._id);
  const userToken = useAppSelector((state) => state.user.userInfo.token);
  const handleCommentSend = () => {
    axios
      .post(
        process.env.NEXT_PUBLIC_API + "comments",
        {
          text: commentText,
          postId: post._id,
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      )
      .then(() => {
        setCommentText("");
      })
      .catch((e) => console.log(e));
  };

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
              <Button colorScheme="red">Удалить</Button>
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
            {comments.map((comment) => {
              return (
                <CommentComponent
                  key={comment._id}
                  username={comment.user.username}
                  createdAt={comment.createdAt}
                  text={comment.text}
                  userId={comment.user._id}
                  commentId={comment._id}
                />
              );
            })}
          </Container>
        )}
        <Box w={["100%", "60%"]}>
          <Text>Оставьте свой комментарий</Text>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button onClick={() => handleCommentSend}>Отправить</Button>
        </Box>
        {comments.map((comment) => (
          <CommentComponent
            key={comment._id}
            username={comment.user.username}
            createdAt={comment.createdAt}
            text={comment.text}
            userId={comment.user._id}
            commentId={comment._id}
          />
        ))}
      </Stack>
    </Box>
  );
};

interface RedactProps {
  post: Post;
  userId: string;
}

const RedactPost: React.FC<RedactProps> = ({ post, userId }) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IPostInputs>({
    defaultValues: {
      title: post.title,
      description: post.description,
      text: post.text,
    },
  });
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [imageIsUploading, setImageIsUploading] = useState<boolean>(false);
  const toast = useToast();
  const { onCopy } = useClipboard(`![alt](${downloadUrl})`);
  const userToken = useAppSelector((state) => state.user.userInfo.token);

  const textWatcher = watch("text");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const extension = image.type.split("/")[1];
      const formData = new FormData();
      formData.append("file", image);

      const fileRef = ref(
        storage,
        `uploads/${userId}/${Date.now()}.${extension}`
      );
      setImageIsUploading(true);

      const task = uploadBytes(fileRef, image);

      task
        .then(() => getDownloadURL(fileRef))
        .then((url) => {
          setDownloadUrl(url);
          setImageIsUploading(false);
        })
        .catch(() => {
          toast({
            title: "Что-то пошло не так🤔",
            status: "error",
          });
        });
    }
  };

  const onSubmit = async (data: IPostInputs) => {
    console.log(post.slug);
    const dataToSend = {
      ...data,
      slug: post.slug,
    };
    const res = await updatePost(dataToSend, post._id, userToken);
    console.log(res);

    if (res) {
      toast({
        status: "success",
        description:
          "Успешно обновили пост, информация на платформе обновится меньше чем через минуту",
      });
    }
  };

  return (
    <Box
      mt={5}
      w={"100%"}
      d={"flex"}
      flexDirection={"column"}
      alignItems={"Center"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ minWidth: "60%" }}
      >
        <Stack spacing={5}>
          <FormControl>
            <Input
              size="lg"
              placeholder={"Введите заголовок статьи"}
              variant="flushed"
              fontWeight={"bold"}
              fontSize={"37"}
              isInvalid={!!errors.title}
              id={"header"}
              {...register("title", {
                required: "Поле обязательно для заполнения",
                minLength: { value: 3, message: "Минимум 3 символа" },
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Введите краткое описание статьи</FormLabel>
            <Input
              size="md"
              {...register("description", {
                required: "Поле обязательно для заполнения",
                minLength: { value: 3, message: "Минимум 3 символа" },
              })}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          <Box d={"flex"} gap={5} flexDirection={["column", "row"]}>
            <Input
              isReadOnly
              placeholder="Здесь будет ссылка на ваше изображение"
              value={downloadUrl ? downloadUrl : ""}
            />
            <IconButton
              icon={<CopyIcon />}
              onClick={onCopy}
              aria-label="Copy image url"
              disabled={!downloadUrl}
            />
          </Box>
          <Button
            rightIcon={imageIsUploading ? undefined : <AddIcon />}
            as={"label"}
            px={10}
            flex={"none"}
            disabled={imageIsUploading}
          >
            {imageIsUploading ? (
              <Spinner />
            ) : (
              <>
                Загрузить изображение
                <Input
                  type={"file"}
                  accept="image/x-png,image/jpeg"
                  onChange={handleImageUpload}
                  hidden
                />
              </>
            )}
          </Button>
          <Flex flexDirection={"column"} gap={2}>
            <Tooltip
              label="Вводите текст с помощью разметки md"
              placement={"left"}
            >
              <QuestionOutlineIcon alignSelf={"end"} />
            </Tooltip>
            {showPreview ? (
              <Container maxW="container.md">
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                  {textWatcher}
                </ReactMarkdown>
              </Container>
            ) : (
              <>
                <FormControl isInvalid={!!errors.text}>
                  <Textarea
                    minH={200}
                    {...register("text", {
                      required: "Поле обязательно для заполнения",
                      minLength: {
                        value: 5,
                        message: "Минимальная длина поста - 5 символов",
                      },
                      maxLength: {
                        value: 65536,
                        message: "Максимальная длина поста - 65т символов",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.text?.message}</FormErrorMessage>
                </FormControl>
              </>
            )}
          </Flex>
          <ButtonGroup>
            <Button type={"submit"} colorScheme="blue">
              Сохранить изменения
            </Button>
            <Button onClick={() => setShowPreview((prev) => !prev)}>
              {showPreview ? "Редактировать" : "Предпросмотр"}
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
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

  const { data: comments } = await axios.get<Comment[]>(
    process.env.NEXT_PUBLIC_API + `comments/post/${post._id}`
  );

  return {
    props: { post, comments },
    revalidate: 10,
  };
};

export default PostPage;
