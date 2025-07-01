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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { FolderClosedIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT, DEFAULT_PROJECT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ProjectCreateModel } from "./project-create-modal";

export const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
    trpc.chats.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

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

  return (
    <Sidebar>
      <SidebarHeader className=" text-sidebar-accent-foreground">
        <Link href={"/"} className=" flex items-center  px-1 pt-2">
          <Image src="/logo.svg" height={36} width={36} alt="ChatGPT-BD" />
          <div className="relative -translate-y-[3px]  ">
            <span className="block text-xl font-semibold leading-none">
              CHATGPT
            </span>
            <span className="absolute top-3.5 left-0.5 text-[10px] font-bold">
              BD
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ProjectCreateModel />

              {projectData.pages
                .flatMap((page) => page.items)
                .map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 cursor-pointer"
                        // pathname == item.href && "bg-border"
                      )}
                      isActive={pathname === "/c/" + project.id}
                      // onClick={() => onSelect(project.id)}
                    >
                      <Link href={`/c/${project.id}`}>
                        <span className=" text-sm font-medium tracking-tight flex items-center  gap-2">
                          <FolderClosedIcon
                            size={16}
                            className=" -translate-y-[2px]"
                          />
                          {project.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              <InfiniteScroll
                isManual
                hasNextPage={projectHasNextPage}
                isFetchingNextPage={projectIsFetchingNextPage}
                fetchNextPage={projectFetchNextPage}
              />
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
                        "h-10 cursor-pointer"
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
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
