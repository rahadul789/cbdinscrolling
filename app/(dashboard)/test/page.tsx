import React, { Suspense } from "react";
import Test from "../../../components/Test";
import { HydrateClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { DEFAULT_LIMIT } from "@/constants";

const page = () => {
  void trpc.projects.getManyPlaylists.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <Test />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
};

export default page;
