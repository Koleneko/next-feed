import type { AppProps } from "next/app";
import { ChakraWithTheme } from "chakra/ChakraProviderWithTheme";
import { wrapper } from "store";
import { Layout } from "components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraWithTheme>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraWithTheme>
  );
}

export default wrapper.withRedux(MyApp);
