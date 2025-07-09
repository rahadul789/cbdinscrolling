"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ChatSectionProps {
  chatId?: string;
}

export const ChatSection = ({ chatId }: ChatSectionProps) => {
  // store this for future
  // const utils = trpc.useUtils()
  // const create = trpc.chats.create.useMutation({
  //     onSuccess: ()=>{
  //         utils.chats.getMany.invalidate()
  //     }
  // })
  // create.pending
  return (
    // <Suspense fallback={<p>Loading...</p>}>
    // <ErrorBoundary fallback={<p>Error</p>}>
    <ChatSectionSuspense chatId={chatId} />
    // </ErrorBoundary>
    // </Suspense>
  );
};

const ChatSectionSuspense = ({ chatId }: ChatSectionProps) => {
  // const [data, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
  //   trpc.chats.getMany.useSuspenseInfiniteQuery(
  //     {
  //       limit: DEFAULT_LIMIT,
  //     },
  //     {
  //       getNextPageParam: (lastPage) => lastPage.nextCursor,
  //     }
  //   );

  return (
    <div>
      {/* {data.pages
        .flatMap((page) => page.items)
        .map((chat) => (
          <div key={chat.id} className=" border py-3">
            <p>{chat.title}</p>
          </div>
        ))} */}
      {/* <InfiniteScroll
        isManual
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      /> */}
    </div>
  );
};
