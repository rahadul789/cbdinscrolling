import { DEFAULT_LIMIT } from "@/constants";
import { ChatsView } from "@/modules/projectsssssssssssssssssssssss/ui/components/chats-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

interface PageParams {
  playlistId: string;
}

const page = async ({ params }: { params: Promise<PageParams> }) => {
  const { playlistId } = await params;

  void trpc.projects.getOneChat.prefetch({ id: playlistId });

  void trpc.projects.getChats.prefetchInfinite({
    playlistId,
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <ChatsView playlistId={playlistId} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default page;
