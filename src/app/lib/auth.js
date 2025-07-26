import credentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/mongodb";   
import usersModel from "@/app/model/user";
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    credentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await usersModel.findOne({ email: credentials.email });
          if (!user) return null;

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isMatch) return null;
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.log("Error in authorizing user", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
