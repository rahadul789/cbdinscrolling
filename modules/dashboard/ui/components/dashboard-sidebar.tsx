"use client";

import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";
import { FolderClosedIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT, DEFAULT_PROJECT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ProjectCreateModal } from "@/modules/projects/ui/components/project-create-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectFolders from "@/modules/projects/ui/components/project-folders";

export const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [data, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
    trpc.chats.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <ProjectFolders />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Chats</SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            {data.pages
              .flatMap((page) => page.items)
              .map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      " cursor-pointer"
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
                      className="w-24 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem>
                        <span>Open</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash2Icon />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            <InfiniteScroll
              isManual
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
