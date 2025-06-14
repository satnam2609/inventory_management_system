import connectDb from "@/libs/config";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        // Basic loggin logic
        try {
          const { email, password } = credentials;
          await connectDb();
          const user = await User.findOne({ email });
          if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
              return user;
            } else null;
          }
          return null;
        } catch (error) {
          console.log("Nextauth signIn error", error);
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.userName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },
  },
  session: {
    stategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
