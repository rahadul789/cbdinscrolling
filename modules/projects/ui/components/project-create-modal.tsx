"use client";

import { FilePlus2Icon, Loader2Icon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import CreateProject from "./project-create";
import { toast } from "sonner";

export const ProjectCreateModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.projects.create.useMutation({
    onSuccess: ({ name }) => {
      toast(`${name}  Created successfully`);
      utils.projects.getMany.invalidate();
    },
  });
  return (
    <>
      <ResponsiveModal
        title=" Create a project"
        open={!!create.data}
        onOpenChange={() => {
          create.reset();
        }}
      >
        <CreateProject />
      </ResponsiveModal>
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
    </>
  );
};
