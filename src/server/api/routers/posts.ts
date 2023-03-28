import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server";

import type { User } from '@clerk/nextjs/dist/api'

const filterUserForClient = (user: User) => {
  return {id: user.id, username: user.username, profileImageUrl: user.profileImageUrl}
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take: 100,
    });

    const users = (await clerkClient.users.getUserList({
        userId : posts.map((post) => post.authorId),
    }) ).map(filterUserForClient);

    console.log(users);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR",
      message: "Author not found",
    });
      return {
      post,
      author,
    }});
  }),
});
