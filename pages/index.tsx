import Head from "next/head";

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
