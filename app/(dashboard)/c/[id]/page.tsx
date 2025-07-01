interface PageParams {
  id: string;
}

const page = async ({ params }: { params: Promise<PageParams> }) => {
  const { id } = await params;

  return <div>{id}</div>;
};

export default page;
