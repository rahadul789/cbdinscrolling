"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, FilePlus2Icon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DashboardCommand } from "./dashboard-command";

export const DashboardHeader = () => {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <Link href="/" className="flex items-center px-2 my-2 ">
        <Image src="/logo.svg" height={26} width={26} alt="Chatgpt-bd Logo" />
        <div className="relative -translate-y-[4px]  ">
          <span className="block  font-semibold leading-none">CHATGPT</span>
          <span className="absolute top-3 left-0.5 text-[10px] font-bold">
            BD
          </span>
        </div>
      </Link>
      <Button
        variant="ghost"
        className=" justify-start bg-transparent ml-0 pl-0 w-full"
      >
        <Link href="/?model=gpt-4o" className=" flex items-center gap-2 pl-2">
          <>
            <Edit size={16} className=" -translate-y-[2px]" />
            New Chat
          </>
        </Link>
      </Button>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <div className="group">
        <Button
          variant="ghost"
          className="justify-start pl-2 w-full "
          onClick={() => {
            setCommandOpen(true);
          }}
        >
          <div className=" flex items-center gap-2">
            <SearchIcon size={16} className="-translate-y-[1px]" />
            Search chats
          </div>
          <kbd className="ml-auto  group-hover:block hidden text-muted-foreground">
            <span className="text-xs  ">&#8984;</span>K
          </kbd>
        </Button>
      </div>
      <div className="mt-2">
        <Separator />
      </div>
    </div>
  );
};
