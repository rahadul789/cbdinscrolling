"use client";

import { FilePlus2Icon, Loader2Icon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const ProjectCreateModel = () => {
  const utils = trpc.useUtils();
  const create = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.getMany.invalidate();
    },
  });
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={cn("h-10 cursor-pointer")}>
        <Button
          onClick={() => create.mutate()}
          variant="ghost"
          className=" justify-start bg-transparent ml-0 pl-0"
          disabled={create.isPending}
        >
          {create.isPending ? (
            <>
              <Loader2Icon className=" animate-spin" /> Creating project
            </>
          ) : (
            <>
              <FilePlus2Icon size={16} className=" -translate-y-[2px]" />
              New project
            </>
          )}
        </Button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
