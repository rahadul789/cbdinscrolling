"use client";

import { PlaylistCreateModal } from "@/modules/projectsssssssssssssssssssssss/ui/components/playlist-create-modal";
import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { PlaylistGridCard } from "@/modules/projectsssssssssssssssssssssss/ui/components";
import { InfiniteScroll } from "./infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";

const Test = () => {
  const [data, query] = trpc.projects.getManyPlaylists.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      {data.pages
        .flatMap((page) => page.items)
        .map((playlist) => (
          <PlaylistGridCard data={playlist} key={playlist.id} />
        ))}
      <PlaylistCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
      <Button
        variant="outline"
        size="icon"
        className=" rounded-full"
        onClick={() => setCreateModalOpen(true)}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default Test;
