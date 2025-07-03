// "use client";

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
import { ProjectCreateModal } from "./project-create-modal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ProjectNameUpdateForm } from "./project-name-update-form";
import { useState } from "react";

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
  ] = trpc.projects.getMany.useSuspenseInfiniteQuery(
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
      toast(`${name}  Created successfully`);
      utils.projects.getMany.invalidate();
    },
  });

  const [isEdit, setIsEdit] = useState<string | null>(null);

  return (
    <>
      <ProjectCreateModal />

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
                  isActive={pathname === "/c/" + project.id}
                  // onClick={() => onSelect(project.id)}
                >
                  <div>
                    <FolderClosedIcon
                      size={16}
                      className=" -translate-y-[2px]"
                    />
                    <span className=" text-sm font-medium tracking-tight ">
                      {project.name}
                    </span>
                  </div>
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
                      <span>Edit</span>
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
