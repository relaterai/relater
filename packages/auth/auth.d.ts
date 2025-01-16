declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
      stripeId: string;
    } & DefaultSession['user'];
  }
}
