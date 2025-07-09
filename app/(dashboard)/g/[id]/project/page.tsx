import { DEFAULT_LIMIT } from "@/constants";
import ProjectLists from "@/modules/g/ui/components/project-lists";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

interface PageParams {
  id: string;
}

const page = async ({ params }: { params: Promise<PageParams> }) => {
  const { id } = await params;
  const match = id.match(/g-p-([a-f0-9\-]{36})/);
  const projectId = match ? match[1] : null;

  if (projectId) {
    void trpc.projects.getProject.prefetch({ id: projectId });
  }

  if (projectId) {
    void trpc.projects.getProjectChats.prefetchInfinite({
      projectId,
      limit: 99,
    });
  }

  if (projectId) {
    void trpc.projects.getProjectsEcxeptCurrentOne.prefetchInfinite({
      projectId,
      limit: 5,
    });
  }

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <ProjectLists projectId={projectId} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default page;
