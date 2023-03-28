import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "@/server/api/trpc";
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
        orderBy: [
          {createdAt: "desc"}
        ]
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

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(240),
      })
    )
    .mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId;

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content: input.content, 
      },
    });

    return post;
  }),
});
