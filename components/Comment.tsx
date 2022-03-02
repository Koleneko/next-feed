import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useAppSelector } from "hooks/redux.hooks";
import {
  useGetCommentsByPostIdQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "store/features/api/comments";
import { useForm } from "react-hook-form";

interface ICommentProps {
  postId: string;
}

interface CreateCommentInput {
  text: string;
}

const CommentComponent: React.FC<ICommentProps> = ({ postId }) => {
  const { data, error, isLoading } = useGetCommentsByPostIdQuery(postId);
  const [createComment, result] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const { register, handleSubmit } = useForm<CreateCommentInput>();

  const userId = useAppSelector((state) => state.user.userInfo._id);

  const handleCommentSend = (data: CreateCommentInput) => {
    createComment({
      text: data.text,
      id: postId,
    });
  };

  if (isLoading)
    return <Text fontWeight={"bold"}>Загружаем комментарии..</Text>;

  return (
    <>
      {data?.length ? (
        data.map((comment) => (
          <CommentRender
            key={comment._id}
            commentText={comment.text}
            username={comment.user.username}
            isOwner={userId === comment.user._id}
            createdAt={comment.createdAt}
            id={comment._id}
            onDelete={deleteComment}
            onChange={updateComment}
          />
        ))
      ) : (
        <Text fontWeight={"bold"} fontSize={"xl"} mt={5}>
          Комментариев пока нет, будьте первыми!
        </Text>
      )}
      <Box w={["100%", "60%"]}>
        <Text>Оставьте свой комментарий</Text>
        <Textarea
          {...register("text", {
            minLength: 5,
          })}
          mb={5}
        />
        <Button
          mt={"5px"}
          onClick={handleSubmit(handleCommentSend)}
          disabled={!userId}
        >
          Отправить
        </Button>
      </Box>
    </>
  );
};

export default CommentComponent;

interface CommentRenderProps {
  username: string;
  createdAt: string;
  commentText: string;
  isOwner: boolean;
  id: string;
  onDelete?: any;
  onChange?: any;
}

export const CommentRender: React.FC<CommentRenderProps> = ({
  username,
  createdAt,
  commentText,
  isOwner,
  id,
  onChange,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { text: commentText },
  });

  const handleDelete = () => {
    onDelete({ id });
  };

  const handleUpdate = (data: any) => {
    onChange({
      id,
      text: data.text,
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      mt={5}
      minH={20}
      p={5}
      d={"flex"}
      flexDirection={"column"}
    >
      <ButtonGroup
        pos={"absolute"}
        isAttached
        size="xs"
        variant="outline"
        alignSelf={"flex-end"}
        mb={5}
        p={0}
        hidden={!isOwner}
      >
        <Button onClick={() => setIsEditing((prev) => !prev)}>
          Редактировать
        </Button>
        <Button onClick={handleDelete}>Удалить</Button>
      </ButtonGroup>

      <VStack alignItems={"flex-start"} spacing={0}>
        <Text fontWeight={"bold"}>{username}</Text>
        <Text fontSize={"sm"}>Created at {createdAt}</Text>
      </VStack>
      <Divider my={2} />
      {!isEditing ? (
        <Text>{commentText}</Text>
      ) : (
        <>
          <Textarea
            {...register("text", {
              minLength: 2,
            })}
          />
          <Button size="xs" mt={2} onClick={handleSubmit(handleUpdate)}>
            Сохранить
          </Button>
        </>
      )}
    </Box>
  );
};
