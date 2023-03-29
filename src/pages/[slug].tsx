import type { 
  GetStaticProps, 
  InferGetStaticPropsType, 
  NextPage 
} from "next";
import Head from "next/head";
import { api } from "@/utils/api";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({username}) => {

  const { data } = api.profile.getUserByUsername.useQuery({
    username: username,
  });
  if (!data) return <div className="h-screen flex justify-center items-center">404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
        <meta name="description" content="" />
      </Head>
      <PageLayout>
        <div className="bg-black h-36 relative">
            <Image 
              src={data.profileImageUrl} 
              alt={`${data.username ?? ""}'s profile picture`} 
              width={148}
              height={148}
              className="-mb-20 absolute bottom-0 left-0 ml-6 rounded-full border-4 border-white"
              />
        </div>
        <div className="h-[64px]"></div>
        <div className="flex p-4 px-14 text-xl font-bold">
          @{data.username}
        </div>
      </PageLayout>
    </>
  ); 
};

import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import { appRouter } from "@/server/api/root";
import { prisma } from '@/server/db'
import superjson from 'superjson'
import { PageLayout } from "@/components/layout";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, 
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error("no slug");


  const username = slug.replace("@", "");
  // fetch data early, hydrate through server side props
  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {paths: [], fallback: "blocking"}
}

export default ProfilePage;