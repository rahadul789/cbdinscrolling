import { ErrorBoundary } from "react-error-boundary";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { DashboardUserButton } from "../components/dashboard-user-button";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { DEFAULT_LIMIT, DEFAULT_PROJECT_LIMIT } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "../components/dashboard-header";

// server components
const DashboardSidebarView = async () => {
  // void trpc.chats.getMany.prefetchInfinite({
  //   limit: DEFAULT_LIMIT,
  // });

  void trpc.projects.getProjects.prefetchInfinite({
    limit: DEFAULT_PROJECT_LIMIT,
  });

  void trpc.chats.getChats.prefetchInfinite({
    limit: DEFAULT_PROJECT_LIMIT,
  });

  // void trpc.search.getMany.prefetchInfinite({
  //   limit: DEFAULT_PROJECT_LIMIT,
  // });

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground ">
        <DashboardHeader />
      </SidebarHeader>
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <DashboardSidebar />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebarView;
