import { ErrorBoundary } from "react-error-boundary";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { DashboardUserButton } from "../components/dashboard-user-button";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { DEFAULT_LIMIT, DEFAULT_PROJECT_LIMIT } from "@/constants";

// server components
const DashboardSidebarView = async () => {
  void trpc.chats.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  void trpc.projects.getMany.prefetchInfinite({
    limit: DEFAULT_PROJECT_LIMIT,
  });
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center px-2 ">
          <Image src="/logo.svg" height={36} width={36} alt="Chatgpt-bd Logo" />
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
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <DashboardSidebar />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </Sidebar>
  );
};

export default DashboardSidebarView;
