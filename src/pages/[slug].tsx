import { type NextPage } from "next";
import Head from "next/head";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>NEXT.js NOTES</title>
        <meta name="description" content="Leave a note!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen mt-8">
        <div className="max-w-3xl">
            hey
        </div>
      </main>
    </>
  ); 
};

export default ProfilePage;