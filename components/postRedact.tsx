import { Post } from "types/post";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IPostInputs } from "pages/create";
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
  Spinner,
  Stack,
  Textarea,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useAppSelector } from "hooks/redux.hooks";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "firebase/app";
import { updatePost } from "services/postCreation.service";
import { AddIcon, CopyIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

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
    const dataToSend = {
      ...data,
      slug: post.slug,
    };
    const res = await updatePost(dataToSend, post._id, userToken);

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

export default RedactPost;
