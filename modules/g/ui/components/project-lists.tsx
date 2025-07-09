"use client";

import { trpc } from "@/trpc/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Edit,
  FolderClosedIcon,
  MoreHorizontalIcon,
  MoveIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatNameUpdateForm } from "@/modules/chats/ui/components/chat-name-update-form";

interface Props {
  projectId: string | null;
}

const ProjectLists = ({ projectId }: Props) => {
  const router = useRouter();
  if (!projectId) {
    return <div>No project selected.</div>;
  }
  const [data] = trpc.projects.getProject.useSuspenseQuery({ id: projectId });

  const [chats, query] = trpc.projects.getProjectChats.useSuspenseInfiniteQuery(
    {
      limit: 99,
      projectId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const [allProjectsExceptOne, queryOption] =
    trpc.projects.getProjectsEcxeptCurrentOne.useSuspenseInfiniteQuery(
      {
        limit: 5,
        projectId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const utils = trpc.useUtils();

  // REMOVE CHAT FROM PROJECT
  const removeChat = trpc.chats.removeChat.useMutation({
    onSuccess: (data) => {
      toast.success("Chat removed from playlist");
      utils.projects.getProjectChats.invalidate({ projectId: data.projectId });
      utils.chats.getChats.invalidate();
      // utils.projects.getManyPlaylists.invalidate();
      // utils.chats.getMany.invalidate();
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
      utils.projects.getProjectChats.invalidate({ projectId: projectId });
      utils.chats.getChats.invalidate();
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // MOVE CHAT FROM ONE PROJECT TO ANOTHER
  const moveChat = trpc.projects.moveChat.useMutation({
    onSuccess: () => {
      utils.projects.getProjectChats.invalidate();
      toast(` project moved successfully`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  // REMOVE PROJECT
  const removeProject = trpc.projects.remove.useMutation({
    onSuccess: ({ name }) => {
      toast(`${name}  removed successfully`);
      router.push("/");
      utils.projects.getProjects.invalidate();
    },
  });

  const [isEdit, setIsEdit] = useState<string | null>(null);

  return (
    <div>
      <div className=" flex gap-4 justify-between">
        <p className=" text-2xl font-bold">{data.name}</p>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => removeProject.mutate({ id: projectId })}
        >
          X
        </Button>
      </div>
      <div>
        {chats.pages
          .flatMap((page) => page.items)
          .map((chat) => (
            <div key={chat.id} className=" flex gap-2 items-center">
              {isEdit === chat.id ? (
                <ChatNameUpdateForm
                  id={chat.id}
                  title={chat.title}
                  setIsEdit={setIsEdit}
                />
              ) : (
                <>
                  <p> {chat.title}</p>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setIsEdit(chat.id)}>
                          <Edit size={16} />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            removeChat.mutate({
                              projectId: projectId,
                              chatId: chat.id,
                            })
                          }
                        >
                          <Undo2Icon />
                          Remove from project
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className=" flex gap-2 items-center">
                            <MoveIcon size={16} />
                            Move to project
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {allProjectsExceptOne.pages
                                .flatMap((page) => page.items)
                                .map((project) => (
                                  <DropdownMenuItem
                                    key={project.id}
                                    onClick={() =>
                                      moveChat.mutate({
                                        fromProjectId: projectId,
                                        toProjectId: project.id,
                                        chatId: chat.id,
                                      })
                                    }
                                  >
                                    <FolderClosedIcon />
                                    {project.name}
                                  </DropdownMenuItem>
                                ))}

                              <InfiniteScroll
                                // isManual
                                hasNextPage={queryOption.hasNextPage}
                                isFetchingNextPage={
                                  queryOption.isFetchingNextPage
                                }
                                fetchNextPage={queryOption.fetchNextPage}
                              />
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            deleteChat.mutate({
                              id: chat.id,
                            })
                          }
                        >
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectLists;
