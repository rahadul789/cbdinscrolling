"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { PlaylistAddModal } from "@/modules/projectsssssssssssssssssssssss/ui/components/playlist-add-modal";
import { trpc } from "@/trpc/client";
import { MoreVerticalIcon, TrashIcon, TvMinimalPlayIcon } from "lucide-react";
import React, { useState } from "react";

interface Props {
  chatId: string;
}

export const ChatIdView = ({ chatId }: Props) => {
  const [data] = trpc.chat.getOne.useSuspenseQuery({ id: chatId });
  // const [isopenPlaylistAddModal, setIsopenPlaylistAddModal] = useState(false);
  return (
    <div>
      <p>{JSON.stringify(data, null, 2)}</p>
      {/* <PlaylistAddModal
        chatId={chatId}
        open={isopenPlaylistAddModal}
        onOpenChange={setIsopenPlaylistAddModal}
      /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className=" flex items-center"
            // onClick={() => setIsopenPlaylistAddModal(true)}
          >
            <TvMinimalPlayIcon />
            <p className=" translate-y-[2px]">Add to playlist</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
