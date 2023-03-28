import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'

import { api, RouterOutputs } from "@/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  console.log(user);

  if (!user) return null;

  return (
    <div className="flex gap-4 w-full px-8 mb-4">
      <Image src={user.profileImageUrl} alt="pfp" 
        width="1000" height="0"
        className="w-12 h-12 rounded-full"
      />
      <input 
        className="bg-transparent px-1 rounded-full w-full grow outline-none"
        placeholder="Add a note here!"
      />
    </div>
  )
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="p-8 border flex items-center gap-5">
      <Image src={author.profileImageUrl} alt={`@${author.username}'s profile picture`}
        width="1000" height="0"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex text-gray-500">
          <span className="font-semibold">@{author.username}</span>
          &nbsp; · &nbsp; 
          <span className="font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery(); 

  if (isLoading ) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!data) return <div className="flex justify-center items-center h-screen">Something went wrong!</div>;

  return (
    <>
      <Head>
        <title>NEXT.js NOTES</title>
        <meta name="description" content="Leave a note!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen mt-8">
        <div className="h-full w-full md:max-w-3xl">
          <div className="p-4 flex">
            {!user.isSignedIn && (
            <div className=""><SignInButton /></div>
            )}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="px-4 flex flex-col">
              {[...data, ...data]?.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id} />
              ))}
          </div>
        </div>
      </main>
    </>
  ); 
};

export default Home;
