"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DEFAULT_LIMIT, DEFAULT_PROJECT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import {
  Edit,
  FolderClosedIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ChatNameUpdateForm } from "./chat-name-update-form";

export const ChatSection = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [data, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
    trpc.chats.getChats.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const {
    data: infiniteProjectData,
    hasNextPage: hnp,
    isFetchingNextPage: ifnp,
    fetchNextPage: fnp,
  } = trpc.projects.getAddToProject.useInfiniteQuery(
    {
      limit: DEFAULT_PROJECT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const utils = trpc.useUtils();

  const addChat = trpc.projects.addToProject.useMutation({
    onSuccess: (data) => {
      toast.success("Chat added to playlist");
      utils.projects.getProjectChats.invalidate({ projectId: data.projectId });
      utils.chats.getChats.invalidate();
      // utils.projects.getManyForChat.invalidate({ chatId });
      // utils.projects.getOneChat.invalidate({ id: data.playlistId });
      // utils.projects.getChats.invalidate({ playlistId: data.playlistId });
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // DELETE CHAT
  const deleteChat = trpc.chats.remove.useMutation({
    onSuccess: (data) => {
      toast.success("Chat deleted successfully");
      utils.chats.getChats.invalidate();
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const [isEdit, setIsEdit] = useState<string | null>(null);

  return (
    <div>
      {data.pages
        .flatMap((page) => page.items)
        .map((chat) => (
          <SidebarMenuItem key={chat.id}>
            {isEdit === chat.id ? (
              <ChatNameUpdateForm
                id={chat.id}
                title={chat.title}
                setIsEdit={setIsEdit}
              />
            ) : (
              <>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    " h-9 cursor-pointer"
                    // pathname == item.href && "bg-border"
                  )}
                  isActive={pathname === "/c/" + chat.id}
                >
                  <Link href={`/c/${chat.id}`}>
                    <span className=" text-sm font-medium tracking-tight">
                      {chat.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="data-[state=open]:bg-accent rounded-sm"
                    >
                      <MoreHorizontalIcon />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-46 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => setIsEdit(chat.id)}>
                      <Edit />
                      Rename
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className=" flex items-center gap-2">
                        <FolderClosedIcon size={18} />
                        Add to Project
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className=" w-46 ">
                          {infiniteProjectData?.pages
                            .flatMap((page) => page.items)
                            .map((project) => (
                              <DropdownMenuItem
                                key={project.id}
                                className="  flex items-center"
                                onClick={() => {
                                  addChat.mutate({
                                    projectId: project.id,
                                    chatId: chat.id,
                                  });
                                }}
                              >
                                <FolderClosedIcon />
                                <span className="truncate text-sm font-medium tracking-tight">
                                  {project.name}
                                </span>
                              </DropdownMenuItem>
                            ))}

                          <InfiniteScroll
                            // isManual
                            hasNextPage={hnp}
                            isFetchingNextPage={ifnp}
                            fetchNextPage={fnp}
                          />
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        deleteChat.mutate({
                          id: chat.id,
                        })
                      }
                    >
                      <Trash2Icon />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </SidebarMenuItem>
        ))}
      <InfiniteScroll
        // isManual
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
