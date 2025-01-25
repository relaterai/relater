import type { Adapter } from "@auth/core/adapters";
import { keys } from "./keys";

export function HTTPAdapter(options?: { authUrl?: string; secret?: string }): Adapter {
  const url = options?.authUrl ?? process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

  const createRequest = async (method: string, data: any) => {
    const isDataString = typeof data === "string";

    try {
      const response = await fetch(`${url}/api/auth/adapter/${method}`, {
        method: "POST",
        body: isDataString ? data : JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${options?.secret ?? keys().AUTH_HTTP_ADAPTER_JWT}`,
          ...(isDataString ? {} : { "Content-Type": "application/json" }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      return res.data;
    } catch (error: unknown) {
      console.error(`Auth adapter error in ${method}:`, error);
      throw new Error(`Failed to execute ${method}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return {
    createUser: async (data) => await createRequest("createUser", data),
    getUser: async (id) => await createRequest("getUser", id),
    getUserByEmail: async (email) => await createRequest("getUserByEmail", email),
    getUserByAccount: async (provider_providerAccountId) =>
      await createRequest("getUserByAccount", provider_providerAccountId),
    updateUser: async (data) => await createRequest("updateUser", data),
    deleteUser: async (id) => await createRequest("deleteUser", id),
    linkAccount: async (data) => await createRequest("linkAccount", data),
    unlinkAccount: async (provider_providerAccountId) =>
      await createRequest("unlinkAccount", provider_providerAccountId),
    getSessionAndUser: async (sessionToken) =>
      await createRequest("getSessionAndUser", sessionToken),
    createSession: async (data) => await createRequest("createSession", data),
    updateSession: async (data) => await createRequest("updateSession", data),
    deleteSession: async (sessionToken) => await createRequest("deleteSession", sessionToken),
    createVerificationToken: async (data) => await createRequest("createVerificationToken", data),
    useVerificationToken: async (identifier_token) => {
      console.log({ identifier_token });
      const token = await createRequest("useVerificationToken", identifier_token);
      console.log({ token });
      return token;
    },
  };
}