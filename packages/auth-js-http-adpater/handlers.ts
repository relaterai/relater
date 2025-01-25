import type { Adapter } from "@auth/core/adapters";
import { type NextRequest, NextResponse } from "next/server";
import { keys } from "./keys";

export const httpAdapterRouteHandlers = ({ adapter }: { adapter: Adapter }) => {
  const isValidRequest = (req: NextRequest) => {
    const expectedSecret = keys().AUTH_HTTP_ADAPTER_JWT;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return false;
    }

    const inputSecret = authHeader.replace("Bearer ", "");
    return inputSecret === expectedSecret && inputSecret.length > 0;
  };

  return {
    POST: async (req: NextRequest, { params }: { params: { method: keyof Adapter } }) => {
      if (!isValidRequest(req)) {
        return NextResponse.json(
          { error: "Invalid or missing authorization header" },
          { status: 401 }
        );
      }
      const paramsAwaited = await params;
      const adapterHook = adapter[paramsAwaited.method];
      if (!adapterHook) {
        return NextResponse.json(
          { error: `Invalid adapter method: ${paramsAwaited.method}` },
          { status: 400 }
        );
      }

      try {
        const contentType = req.headers.get("Content-Type");
        if (!contentType) {
          throw new Error("Missing Content-Type header");
        }

        const input = contentType === "application/json"
          ? await req.json()
          : await req.text();

        const result = await adapterHook(input, {} as never);
        return NextResponse.json({ data: result }, { status: 200 });
      } catch (error) {
        console.error("[HTTP Adapter Error]:", error);
        const isJsonError = error instanceof SyntaxError;

        return NextResponse.json({
          error: isJsonError
            ? "Invalid JSON payload"
            : "Internal server error"
        }, {
          status: isJsonError ? 400 : 500
        });
      }
    },
  };
};