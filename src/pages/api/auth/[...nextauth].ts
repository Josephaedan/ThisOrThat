import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import bcrypt from "bcrypt";
import { redirect } from "next/dist/server/api-utils";
import { randomUUID } from "crypto";
import { signIn } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { encode, decode, JWTDecodeParams } from "next-auth/jwt";

const adapter = PrismaAdapter(prisma);

const generateSessionToken = () => {
  return randomUUID();
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: adapter,
  // secret: process.env.JWT_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (!user?.password) {
          throw new Error("User has no password");
        }
        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const customAuthOptions: NextAuthOptions = {
    ...authOptions,
    // Include user.id on session
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (
          req?.query?.nextauth?.includes("callback") &&
          req?.query?.nextauth?.includes("credentials")
        ) {
          if (user) {
            const sessionToken = generateSessionToken(); // Implement a function to generate the session token (you can use randomUUID as an example)
            const sessionMaxAge = 60 * 60 * 24 * 30; //30Days
            const sessionExpiry = new Date(Date.now() + sessionMaxAge * 1000);

            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }
        return true;
      },
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
        }
        return session;
      },
      async redirect({ url, baseUrl }) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      },
    },
    jwt: {
      encode: async ({ secret, token, maxAge }) => {
        if (
          req?.query?.nextauth?.includes("callback") &&
          req?.query?.nextauth?.includes("credentials")
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) {
            return cookie;
          }
          return "";
        }
        // Revert to default encode function if not in credentials flow
        return encode({ secret, token, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req?.query?.nextauth?.includes("callback") &&
          req?.query?.nextauth?.includes("credentials")
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
  };

  return await NextAuth(req, res, customAuthOptions);
}