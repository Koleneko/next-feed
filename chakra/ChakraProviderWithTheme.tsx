// e.g. src/ChakraWithTheme.js
// a) import `ChakraProvider` component as well as the storageManagers
import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import theme from "../styles/theme";

export interface ChakraProps {
  cookies?: string | undefined;
  children?: React.ReactNode;
}

export const ChakraWithTheme: React.FC<ChakraProps> = ({
  cookies,
  children,
}) => {
  // b) Pass `colorModeManager` prop
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManager(cookies)
      : localStorageManager;

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export const getServerSideProps: GetServerSideProps<ChakraProps> = async ({
  req,
}: GetServerSidePropsContext) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
