import { ChatIdView } from "@/modules/c/ui/views/chat-id-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

interface PageParams {
  id: string;
}

const page = async ({ params }: { params: Promise<PageParams> }) => {
  const { id } = await params;
  void trpc.chats.getOne.prefetch({ id });

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <ChatIdView chatId={id} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default page;
