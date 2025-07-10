"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashbarNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <nav className=" flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className=" size-9" variant="outline" onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className=" size-4" />
          ) : (
            <PanelLeftCloseIcon className=" size-4" />
          )}
        </Button>
      </nav>
    </>
  );
};
