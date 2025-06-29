import { HydrateClient, trpc } from "@/trpc/server";
import Client from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const page = async () => {
  void trpc.hello.prefetch({ text: "Reason2" });
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <Client />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default page;
