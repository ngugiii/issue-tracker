import bcrypt from "bcrypt";
import prisma from "@/prisma/client";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
          }

          let role = "user";
          if (user.email === "admin@gmail.com") {
            role = "admin";
          }

          const accessToken = jwt.sign(
            {
              userId: user.id,
              email: user.email,
              userName: user.userName,
              role:role,
            },
            process.env.JWT_SECRET || "",
            { expiresIn: "1h" }
          );

          const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET || "",
            { expiresIn: "7d" }
          );

          return {
            ...user,
            accessToken,
            refreshToken,
            userId: user.id,
            role,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token, user }) {
      session.userId = token.userId;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.userId;
        token.role = user.role;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
