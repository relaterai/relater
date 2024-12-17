declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
