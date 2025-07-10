"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DEFAULT_PROJECT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2Icon, MessageCircleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const [query, setQuery] = useState("");

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    trpc.search.getMany.useInfiniteQuery(
      {
        query,
        limit: DEFAULT_PROJECT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: open,
      }
    );

  console.log(data);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl h-[90%] md:h-auto  p-2 ">
          <DialogHeader className=" mb-1">
            <DialogTitle></DialogTitle>
            <input
              placeholder="Search chats..."
              className=" outline-none pl-2 py-1 text-sm "
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <Separator />
          </DialogHeader>
          <div className=" h-[400px] overflow-auto">
            <Button
              className=" w-full justify-start py-6 mb-1"
              variant="secondary"
            >
              <Edit />
              <span>New chat</span>
            </Button>
            {isLoading ? (
              <div className=" flex justify-center p-4">
                <Loader2Icon className=" size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {data?.pages?.length === 0 ||
                data?.pages?.flatMap((page) => page.items).length === 0 ? (
                  <p className="  py-6 text-center text-sm">No results found</p>
                ) : (
                  <div>
                    {data?.pages
                      .flatMap((page) => page.items)
                      .map((chat) => (
                        <div key={chat.id}>
                          <Button
                            className=" w-full justify-start py-6 text-a"
                            variant="ghost"
                          >
                            <MessageCircleIcon />
                            <span>{chat.title}</span>
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
            <InfiniteScroll
              // isManual
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

//  <CommandDialog open={open} onOpenChange={setOpen}>
//       <Command className="rounded-lg border shadow-md md:min-w-[650px] min-h-[400px]">
//         <CommandInput placeholder="Search chats..." />
//         <CommandList>
//           {!isFetching && (
//             <CommandEmpty className=" ">No results found.</CommandEmpty>
//           )}
//           <CommandGroup>
//             {isFetching ? (
//               <p>Loading</p>
//             ) : (
{
  /* <div>
  {data?.pages
    .flatMap((page) => page.items)
    .map((chat) => (
      <div key={chat.id}>
        <CommandItem>
          <MessageCircleIcon />
          <span>{chat.title}</span>
        </CommandItem>
      </div>
    ))}
</div> */
}
//             )}
//           </CommandGroup>
//         </CommandList>
//         <InfiniteScroll
//           isManual
//           hasNextPage={hasNextPage}
//           isFetchingNextPage={isFetchingNextPage}
//           fetchNextPage={fetchNextPage}
//         />
//       </Command>
//     </CommandDialog>
