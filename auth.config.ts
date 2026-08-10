import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js configuration used by the middleware.
 * The credentials provider (which needs Prisma/bcrypt) lives in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin-login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute && nextUrl.pathname === "/admin/login") {
        return true;
      }
      if (isAdminRoute && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;