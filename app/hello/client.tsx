"use client";

import { trpc } from "@/trpc/client";

const Client = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Reason2",
  });
  return <div>{data.greeting}</div>;
};

export default Client;
