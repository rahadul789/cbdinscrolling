"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/trpc/client";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

interface Props {
  chatId: string;
}

export const ChatIdView = ({ chatId }: Props) => {
  const [data] = trpc.chat.getOne.useSuspenseQuery({ id: chatId });
  return (
    <div>
      <p>{JSON.stringify(data, null, 2)}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem className=" flex items-center">
            <TrashIcon />
            <p className=" translate-y-[2px]">Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
