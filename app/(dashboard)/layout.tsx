import { SidebarProvider } from "@/components/ui/sidebar";
import { DashbarNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className=" flex flex-col h-screen w-screen bg-muted">
        <DashbarNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
