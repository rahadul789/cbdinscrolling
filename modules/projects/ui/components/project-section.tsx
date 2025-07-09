"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Edit,
  FilePlus2Icon,
  FolderClosedIcon,
  MoreHorizontalIcon,
  ShareIcon,
  Trash2,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { DEFAULT_PROJECT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "sonner";
import { useState } from "react";
import { ProjectCreateModal } from "./project-create-modal";
import { Button } from "@/components/ui/button";
import { ProjectNameUpdateForm } from "./project-name-update-form";

const ProjectFolders = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [
    projectData,
    {
      hasNextPage: projectHasNextPage,
      isFetchingNextPage: projectIsFetchingNextPage,
      fetchNextPage: projectFetchNextPage,
    },
  ] = trpc.projects.getProjects.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_PROJECT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const utils = trpc.useUtils();
  const removeProject = trpc.projects.remove.useMutation({
    onSuccess: ({ name }) => {
      toast(`${name}  removed successfully`);
      utils.projects.getProjects.invalidate();
      utils.projects.getAddToProject.invalidate();
    },
  });

  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const isPending = false;

  return (
    <>
      <ProjectCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <SidebarMenuItem>
        <SidebarMenuButton asChild className={cn("cursor-pointer")}>
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="ghost"
            className=" justify-start bg-transparent ml-0 pl-0"
            disabled={isPending}
          >
            <>
              <FilePlus2Icon size={16} className=" -translate-y-[2px]" />
              New project
            </>
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {projectData.pages
        .flatMap((page) => page.items)
        .map((project) => (
          <SidebarMenuItem key={project.id}>
            {isEdit === project.id ? (
              <ProjectNameUpdateForm
                id={project.id}
                name={project.name}
                setIsEdit={setIsEdit}
              />
            ) : (
              <>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    " cursor-pointer"
                    // pathname == item.href && "bg-border"
                  )}
                  isActive={
                    pathname ===
                    "/g/g-p-" +
                      project.id +
                      "-" +
                      project.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "") +
                      "/project"
                  }
                  // onClick={() => onSelect(project.id)}
                >
                  <Link
                    href={
                      "/g/g-p-" +
                      project.id +
                      "-" +
                      project.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "") +
                      "/project"
                    }
                  >
                    <FolderClosedIcon
                      size={16}
                      className=" -translate-y-[2px]"
                    />
                    <span className=" text-sm font-medium tracking-tight ">
                      {project.name}
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
                    className="w-24 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => setIsEdit(project.id)}>
                      <Edit />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShareIcon />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => removeProject.mutate({ id: project.id })}
                    >
                      <Trash2 />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </SidebarMenuItem>
        ))}
      <InfiniteScroll
        isManual
        hasNextPage={projectHasNextPage}
        isFetchingNextPage={projectIsFetchingNextPage}
        fetchNextPage={projectFetchNextPage}
      />
    </>
  );
};

export default ProjectFolders;
