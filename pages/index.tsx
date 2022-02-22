import type { NextPage } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import { withLayout } from "components/Layout";

const Home = (): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Feed blog</title>
        <meta name="description" content="Blog for everyone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default Home;
// export default withLayout(Home);
