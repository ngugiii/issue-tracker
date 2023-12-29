import bcrypt from "bcrypt";
import prisma from "@/prisma/client";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

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

          let role = 'client';
          if (user.email === 'admin@gmail.com') {
            role = 'admin';
          }

          const accessToken = jwt.sign(
            {
              userId: user.id,
              email: user.email,
              userName: user.userName,
              role,
            },
            process.env.JWT_SECRET || "",
            { expiresIn: "1h" }
          );

          // Generate refresh token
          const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET || "",
            { expiresIn: "7d" }
          );

          console.log(accessToken);

          return {
            ...user,
            accessToken,
            refreshToken,
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
//   callbacks: {
//     // async signIn({ user, account, profile, email, credentials }) {
//     //   return true
//     // },
//     // async redirect({ url, baseUrl }) {
//     //   return baseUrl
//     // }
//     async jwt({ token, user, session }) {
//       console.log("jwt callback",{token,user,session});
//       return token;
      
//     },
//     async session({ session, user, token }) {
//       console.log("session callback",{token,user,session});
//       return session;

//     },
// },
};

const handler =  NextAuth(authOptions);
export {handler as GET, handler as POST };
