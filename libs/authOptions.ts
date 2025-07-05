import  { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "@/libs/db";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials: any) => {
        const { email, password } = credentials;
        try {
          await connect();
          const userExists = await User.findOne({ email });
          if (userExists) {
            if (await bcrypt.compare(password, userExists.password)) {
              return userExists;
            }
          }
          return null;
        } catch (error) {
          console.log("NextAuth Sigin Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ user, token }) => {
      if (user) {
        console.log(user)
        token.id = user._id;
        token.role = user.role;
        token.name = user.name;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.role= token.role as string;
      session.user.name= token.name as string;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};