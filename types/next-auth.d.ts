import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    name: string;
    email: string;
    role: string;
  }

  interface Session {
    user:User
  }

 
}
