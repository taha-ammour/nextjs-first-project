import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../../../../helpers/server-helpers";
import prisma from "../../../../../prisma";
import bcrypt from 'bcrypt';

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "Username:",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials.password) {
          console.error('Missing username or password');
          throw new Error('Missing username or password');
        }
        try {
          await prisma.$connect();
          const user = await prisma.user.findFirst({
            where: { username: credentials.username },
          });
          if (!user || !user.hashedPassword) {
            console.error('No user found or password is incorrect');
            throw new Error('No user found or password is incorrect');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );
          if (!isPasswordCorrect) {
            console.error('Invalid password');
            throw new Error('Invalid password');
          }
          return { ...user, id: user.id.toString() }; // Ensure the id is a string
        } catch (error) {
          console.error('Error authorizing credentials:', error);
          throw new Error('Error authorizing credentials');
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    newUser: "/auth/newuser",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(options);
