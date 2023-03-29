import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server";

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import { filterUserForClient } from "@/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";


const addUsersDataToPosts = async (posts: Post[]) => {

  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author || !author.username)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author not found!",
      });

      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
  })
}

// new ratelimiter, allows 1 request per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true
});

export const postsRouter = createTRPCRouter({

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({
    ctx, input}) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id }
    });

    if (!post) throw new TRPCError({
      code: "NOT_FOUND",
    });

    return (await addUsersDataToPosts([post]))[0];
  }),

  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take: 100,
        orderBy: [
          {createdAt: "desc"}],
    });

    return addUsersDataToPosts(posts);
  }),


  getPostsByUserId: publicProcedure.input(
    z.object({
      userId: z.string(),
    }))
    .query(({ 
      ctx, input }) => ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
      },
      take: 100,
      orderBy: [{ createdAt: "desc"}],
    }).then(addUsersDataToPosts)
  ),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(240),
      })
    )
    .mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId;

    const { success } = await ratelimit.limit(authorId);

    if(!success) throw new TRPCError({
      code: "TOO_MANY_REQUESTS"
    })

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content: input.content, 
      },
    });

    return post;
  }),
});
