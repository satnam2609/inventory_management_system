import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions";


const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };
