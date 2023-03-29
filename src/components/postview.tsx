import Image from 'next/image'
import Link from "next/link";

import type {  RouterOutputs } from "@/utils/api";

import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="py-8 px-4 border-b flex items-center gap-5">
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
        <span className="">{post.content}</span>
      </div>
    </div>
  );
};