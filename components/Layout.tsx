import Navbar from "components/Navbar";
import { Component, FunctionComponent, ReactNode } from "react";
import { Container } from "@chakra-ui/react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <Navbar />
      <Container maxW="2xl" overflow-y={"overlay"}>
        <main>{children}</main>
      </Container>
    </>
  );
};

// export const withLayout = <T extends Record<string, unknown>>(
//   Component: FunctionComponent<T>
// ) => {
//   return function withLayoutComponent(props: T): JSX.Element {
//     return (
//       <Layout>
//         <Component {...props} />
//       </Layout>
//     );
//   };
// };
