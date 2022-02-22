import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "styles/Post.module.css";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
  useBreakpointValue,
  Link as ChakraLink,
} from "@chakra-ui/react";

interface PostProps {
  imageURL?: string;
  heading: string;
  text: string;
}

const Post: FC = () => {
  const imageSize = useBreakpointValue({ base: 300, md: 150 });

  return (
    <Box p={4} display={{ md: "flex" }}>
      <Box flexShrink={0}>
        <Image
          className={styles.PostImage}
          width={imageSize ? imageSize : 160}
          height={imageSize ? imageSize : 100}
          src={"/../public/user.png"}
          alt="Woman paying for a purchase"
        />
      </Box>
      <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
        <Link href="#" passHref={true}>
          <ChakraLink
            mt={1}
            display="block"
            fontSize="lg"
            lineHeight="normal"
            fontWeight="semibold"
            href={"#"}
          >
            Finding customers for your new business
          </ChakraLink>
        </Link>
        <Text mt={2} color="gray.500">
          Getting a new business off the ground is a lot of hard work. Here are
          five ideas you can use to find your first customers.
        </Text>
      </Box>
    </Box>
  );
};

export default Post;
