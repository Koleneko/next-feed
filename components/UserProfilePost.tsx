import { FC } from "react";
import Link from "next/link";
import {
  Box,
  Link as ChakraLink,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Post } from "types/post";

const UserProfilePost: FC<Post> = (props) => {
  const imageSize = useBreakpointValue({ base: 300, md: 150 });

  return (
    <Box
      p={4}
      w={"100%"}
      border="solid"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={"lightgray"}
      backgroundColor={"blackAlpha.100"}
    >
      <Link
        href={`/users/${props.user.username}/${props.slug}`}
        passHref={true}
      >
        <ChakraLink
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href={"#"}
        >
          {props.title}
        </ChakraLink>
      </Link>
      <Text mt={2} color="gray.500">
        {props.description}
      </Text>
    </Box>
  );
};

export default UserProfilePost;
