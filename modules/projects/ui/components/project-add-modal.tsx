"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_PROJECT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface ProjectAddModalProps {
  // chatId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectAddModal = ({
  // chatId,
  open,
  onOpenChange,
}: ProjectAddModalProps) => {
  const utils = trpc.useUtils();
  // const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
  //   trpc.projects.getManyForChat.useInfiniteQuery(
  //     {
  //       limit: DEFAULT_PROJECT_LIMIT,
  //       chatId,
  //     },
  //     {
  //       getNextPageParam: (lastPage) => lastPage.nextCursor,
  //       enabled: !!chatId && open, // eta add korsi coz amra initially load korte chai na. modal open korle data fetching hobe
  //     }
  //   );

  // const addChat = trpc.projects.addChat.useMutation({
  //   onSuccess: (data) => {
  //     toast.success("Chat added to playlist");
  //     utils.projects.getManyPlaylists.invalidate();
  //     utils.chats.getMany.invalidate();
  //     utils.projects.getManyForChat.invalidate({ chatId });
  //     utils.projects.getOneChat.invalidate({ id: data.playlistId });
  //     utils.projects.getChats.invalidate({ playlistId: data.playlistId });
  //   },

  //   onError: () => {
  //     toast.error("Something went wrong");
  //   },
  // });

  // const removeChat = trpc.projects.removeChat.useMutation({
  //   onSuccess: (data) => {
  //     toast.success("Chat removed from playlist");
  //     // utils.projects.getManyPlaylists.invalidate();
  //     // utils.chats.getMany.invalidate();
  //     // utils.projects.getManyForChat.invalidate({ chatId });
  //     // utils.projects.getOneChat.invalidate({ id: data.playlistId });
  //     // utils.projects.getChats.invalidate({ playlistId: data.playlistId });
  //   },

  //   onError: () => {
  //     toast.error("Something went wrong");
  //   },
  // });

  return (
    <>
      <ResponsiveModal
        title=" Add to playlist"
        open={open}
        onOpenChange={onOpenChange}
      >
        {/* {isLoading && (
          <div className=" flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )} */}
        <div className=" flex flex-col gap-2">
          {/* {!isLoading &&
            data?.pages
              .flatMap((page) => page.items)
              .map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  className=" w-full justify-start px-2 [&_svg]:size-5 "
                  size="lg"
                  onClick={() => {
                    if (playlist.containsChat) {
                      removeChat.mutate({ playlistId: playlist.id, chatId });
                    } else {
                      addChat.mutate({ playlistId: playlist.id, chatId });
                    }
                  }}
                  disabled={removeChat.isPending || addChat.isPending}
                >
                  {playlist.containsChat ? (
                    <SquareCheckIcon className=" mr-2" />
                  ) : (
                    <SquareIcon className=" mr-2" />
                  )}
                  {playlist.name}
                </Button>
              ))} */}
          {/* {!isLoading && (
            <InfiniteScroll
              // isManual
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          )} */}
        </div>
      </ResponsiveModal>
    </>
  );
};
