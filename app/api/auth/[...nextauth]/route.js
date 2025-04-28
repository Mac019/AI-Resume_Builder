import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    pages: {
      signIn: '/', // still use home page for sign in button
    },
    callbacks: {
      async redirect({ url, baseUrl }) {
        return "/dashboard";
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
