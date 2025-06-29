"use client";

import { trpc } from "@/trpc/client";

const Client = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Chatgpt bd",
  });
  return <div>{data.greeting}</div>;
};

export default Client;
