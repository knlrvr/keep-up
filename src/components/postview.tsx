import Image from 'next/image'
import Link from "next/link";
import { useState } from 'react'

import {
  BsArrowRepeat, 
  BsUpload,
  BsArrowDownSquare,
  BsArrowUpSquare,
  BsChatLeft,
  BsBarChart,
  BsHeart
} from 'react-icons/bs'

import type {  RouterOutputs } from "@/utils/api";

import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '@clerk/nextjs';
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const [count, setCount] = useState(0);

  const { isLoaded: isSignedIn } = useUser();

  return (
    <>
      <div key={post.id} className="py-10 px-4 border-b flex flex-col relative">
        <div className="flex gap-5">
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
            <span className="mt-1 mr-8">{post.content}</span>
          </div>
          {isSignedIn && ( 
          <div className="flex flex-col gap-1 absolute right-4 top-9 items-center">
            <button type='button'
              onClick={() => setCount((count) => count + 1)}>
              <BsArrowUpSquare 
                className="text-gray-500 hover:text-green-600 cursor-pointer" />
            </button>
              <span className="text-sm font-thin">{count}</span>
            <button type='button'
              onClick={() => setCount((count) => count - 1)}>
              <BsArrowDownSquare 
                className="text-gray-500 hover:text-red-600 cursor-pointer" />
            </button>
          </div>
          )}
        </div>

        {/* add favorite/repost/share functionality here */}

        {/* <div className="flex mt-8 px-1 justify-between items-center">
          <div className="flex justify-start space-x-24">
            <BsArrowRepeat 
              className="hover:text-blue-400 cursor-pointer text-lg" />
            <BsUpload 
              className="hover:text-gray-400 cursor-pointer" />
          </div>
        </div> */}
      </div>
    </>
  );
};