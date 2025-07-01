import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { LucideMoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    isManual,
    fetchNextPage,
  ]);

  return (
    <div className=" ">
      <div ref={targetRef} className="h1" />

      <SidebarMenuItem>
        {hasNextPage ? (
          <SidebarMenuButton asChild className={cn("h-10 cursor-pointer")}>
            <Button
              variant="secondary"
              disabled={!hasNextPage || isFetchingNextPage}
              onClick={() => fetchNextPage()}
              className=" w-full justify-start ml-0 pl-2 bg-transparent"
            >
              {isFetchingNextPage ? (
                "Loading..."
              ) : (
                <div className=" flex items-center gap-2">
                  <LucideMoreHorizontal size={16} className=" " />
                  See more
                </div>
              )}
            </Button>
          </SidebarMenuButton>
        ) : (
          <p className=" text-xs text-muted-foreground">
            You have reached the end of the list
          </p>
        )}
      </SidebarMenuItem>
    </div>
  );
};
