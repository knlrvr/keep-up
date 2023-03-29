import { type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image'
import Link from "next/link";

import { LoadingPage } from "@/components/loading";

import { api, RouterOutputs } from "@/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "@/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput('');
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]!);
      } else {
        toast.error("Failed to post! Please try again later.")
      };
    }
  }); 

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
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
      <button onClick={() => mutate({ content: input})}>
        Post
      </button>
      )}

      {isPosting && 
        <div className="flex items-center justify-center">
          <span>Posting</span>
        </div>
      }
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
        <div className="flex text-gray-500 text-sm">
          <Link href={`/${author.username}`}
            className="hover:text-gray-300">
            <span className="font-semibold">@{author.username}</span>
          </Link>
          &nbsp; · &nbsp; 
          <Link href={`/post/${post.id}`}
            className="hover:underline hover:underline-offset-4 hover:text-gray-300">
            <span className="font-thin">
              {`${dayjs(post.createdAt).fromNow()}`}
            </span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  
  if (postsLoading) return <LoadingPage />;

  if (!data) return <div className="h-screen flex justify-center items-center">Something went wrong!</div>;
  
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // fetch asap
  api.posts.getAll.useQuery(); 

  // empty div if user isn't loaded ¯\_(ツ)_/¯
  if (!userLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="p-4">
          {!isSignedIn && (
            <div className=""><SignInButton /></div>
          )}
          {
            isSignedIn && <CreatePostWizard />
          }

          <Feed />
        </div>
      </PageLayout>
    </>
  ); 
};

export default Home;
