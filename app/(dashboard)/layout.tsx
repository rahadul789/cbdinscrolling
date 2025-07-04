import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { DashbarNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import DashboardSidebarView from "@/modules/dashboard/ui/views/dashboard-sidebar-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <SidebarProvider>
      <DashboardSidebarView />
      <main className=" flex flex-col h-screen w-screen bg-muted">
        <DashbarNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
