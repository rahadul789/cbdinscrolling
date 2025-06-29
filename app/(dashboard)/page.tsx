import React from "react";
import { HomeView } from "../home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <HomeView />
      <div>
        {session.user.name}
        {/* <Button onClick={() => authClient.signOut()}>Signout</Button> */}
      </div>
    </div>
  );
};

export default page;
