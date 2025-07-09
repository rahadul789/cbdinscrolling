"use client";

import { FilePlus2Icon, Loader2Icon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Project name required" }),
});

export const ProjectCreateModal = ({
  open,
  onOpenChange,
}: ProjectCreateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = trpc.useUtils();
  // CREATE PROJECT
  const create = trpc.projects.createProject.useMutation({
    onSuccess: ({ name }) => {
      toast.success(`${name}  Created successfully`);
      form.reset();
      onOpenChange(false);
      utils.projects.getProjects.invalidate();
      utils.projects.getAddToProject.invalidate();
      utils.projects.getProjectsEcxeptCurrentOne.invalidate();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };
  return (
    <>
      <ResponsiveModal
        title=" Create a playlist"
        open={open}
        onOpenChange={onOpenChange}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Project name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex justify-end">
              {create.isPending ? (
                <>
                  <Button disabled type="submit">
                    <Loader2Icon className=" animate-spin" />
                    Creating...
                  </Button>
                </>
              ) : (
                <>
                  <Button type="submit">Create</Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </>
  );
};
