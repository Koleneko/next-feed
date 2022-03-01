import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useAppSelector } from "hooks/redux.hooks";

interface ICommentProps {
  username: string;
  createdAt: string;
  text: string;
  userId: string;
  commentId: string;
}

const CommentComponent: React.FC<ICommentProps> = ({
  username,
  createdAt,
  text,
  commentId,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>(text);

  const userToken = useAppSelector((state) => state.user.userInfo.token);
  const toast = useToast();

  const handleCommentChange = () => {
    axios
      .patch(
        process.env.NEXT_PUBLIC_API + `comments/${commentId}`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      )
      .then(() =>
        toast({
          status: "success",
          description: "Успешно обновили комментарий",
        })
      )
      .catch((e) => {
        toast({
          status: "error",
          description: e.message,
        });
      });
  };

  const handleCommentDelete = () => {
    if (confirm("Вы действительно хотите удалить комментарий?")) {
      axios
        .delete(process.env.NEXT_PUBLIC_API + `comments/${commentId}`, {
          headers: {
            Authorization: userToken,
          },
        })
        .catch((e) => {
          console.log(e);
        });
    }
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
      >
        <Button onClick={() => setIsEditing((prev) => !prev)}>
          Редактировать
        </Button>
        <Button onClick={() => handleCommentDelete()}>Удалить</Button>
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
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button size="xs" mt={2} onClick={handleCommentChange}>
            Сохранить
          </Button>
        </>
      )}
    </Box>
  );
};

export default CommentComponent;
