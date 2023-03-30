import { type NextPage } from "next";
import Image from 'next/image'

import { LoadingPage } from "@/components/loading";
import { PostView } from "@/components/postview";

import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";


import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "@/components/layout";

import Navbar from "@/components/navbar";

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
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.")
      }
    }
  }); 

  if (!user) return null;

  return (
    <div className="flex gap-4 w-full py-8 px-4 border-b mt-36">
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
      <button onClick={() => mutate({ content: input})}
        className="px-6 rounded-full bg-blue-400 text-white hover:bg-blue-300 transition duration-300">
        Post
      </button>
      )}

      {isPosting && 
        <div className="flex items-center justify-center px-6 rounded-full bg-blue-400 text-white hover:bg-blue-300 transition duration-300">
          <span>Posting</span>
        </div>
      }
    </div>
  )
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
      <Navbar />
      <PageLayout>
        <div className="mt-32">
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
