import { z } from "zod";
import bcrypt from "bcrypt";
import { router, publicProcedure, protectedProcedure } from "../trpc";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user.id;
    const user = ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user exists already
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }
      // Hash password and create user in db
      const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(input.password, salt);
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });
      if (!user) {
        throw new Error("User could not be created");
      }
      const account = await ctx.prisma.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: user.id,
        },
      });
      if (!account) {
        throw new Error("Account could not be created");
      }

      if (user && account) {
        return user;
      }
    }),
});
