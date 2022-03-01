import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Progress,
  Spinner,
  Stack,
  Textarea,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import { AddIcon, CopyIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "hooks/redux.hooks";
import useMounted from "hooks/useMounted";
import { createPost } from "store/features/posts/actions";
import { Post } from "types/post";
import { storage } from "../firebase/app";
import React, { useEffect, useState } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { checkSlugUniqueness } from "services/unique.service";
import { slugParser } from "utils/slugParser";

export interface IPostInputs {
  title: string;
  description: string;
  text: string;
  slug: string;
  photoUrl?: string;
}

const CreatePost = () => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [imageIsUploading, setImageIsUploading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [slugValue, setSlugValue] = useState<string>("");
  const { onCopy } = useClipboard(`![alt](${downloadUrl})`);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setError,
  } = useForm<IPostInputs>();

  const userInfo = useAppSelector((state) => state.user.userInfo);
  const postUploadStatus = useAppSelector((state) => state.post.status);

  const router = useRouter();
  const toast = useToast();
  const mounted = useMounted();
  const dispatch = useAppDispatch();

  if (!userInfo && mounted) {
    toast({ description: "Чтобы написать пост нужно зайти в аккаунт" });
    router.replace("/");
  }

  useEffect(() => {
    switch (postUploadStatus) {
      case "error": {
        toast({
          status: "error",
          description: "Что-то пошло не так",
        });
        return;
      }
      case "success": {
        router.push(`/users/${userInfo.username}/${slugValue}`);
      }
    }
  }, [postUploadStatus]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const extension = image.type.split("/")[1];
      const formData = new FormData();
      formData.append("file", image);

      const fileRef = ref(
        storage,
        `uploads/${userInfo._id}/${Date.now()}.${extension}`
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

  const textWatcher = watch("text");
  const slug = watch("title");

  const onSubmit = (data: IPostInputs) => {
    data.slug = slugValue;
    dispatch(createPost(data));
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
                onBlur: async () => {
                  const res = await checkSlugUniqueness(slug);
                },
              })}
            />
            <FormLabel>
              {slugValue ? `Короткая ссылка на ваш пост: ${slugValue}` : ""}
            </FormLabel>
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
              <Container maxW={[null, "container.md"]}>
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
            <Button type={"submit"} disabled={isSubmitting} colorScheme="blue">
              Опубликовать
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

export default CreatePost;
