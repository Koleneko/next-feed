import Navbar from "components/Navbar";
import { ReactNode } from "react";
import { Box, Container } from "@chakra-ui/react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <Navbar />
      <Box m={5} overflow-y={"overlay"}>
        <main>{children}</main>
      </Box>
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
