import { HydrateClient, trpc } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/view/home-view";
import { DEFAULT_LIMIT } from "@/constants";

export const dynamic = "force-dynamic"; // eta na korle eta k static copmonent count korbe and build er shomoy error dibe

interface PageParams {
  chatId?: string;
}

const page = async ({ params }: { params: Promise<PageParams> }) => {
  const { chatId } = await params;
  // void trpc.chats.getMany.prefetchInfinite({
  //   limit: DEFAULT_LIMIT,
  // });

  return (
    <div>
      {/* <HydrateClient> */}
      <HomeView chatId={chatId} />
      {/* </HydrateClient> */}
    </div>
  );
};

export default page;
