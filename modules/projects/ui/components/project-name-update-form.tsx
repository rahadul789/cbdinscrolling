"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface ProjectNameUpdateProps {
  id: string;
  name: string;
  setIsEdit: (value: string | null) => void;
}

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
});

export const ProjectNameUpdateForm = ({
  id,
  name,
  setIsEdit,
}: ProjectNameUpdateProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name ?? "Untitled",
    },
  });

  const utils = trpc.useUtils();
  const updateName = trpc.projects.update.useMutation({
    onSuccess: ({ name }) => {
      toast(`${name}  updated successfully`);
      utils.projects.getMany.invalidate();
      setIsEdit(null);
    },
  });

  const isPending = updateName.isPending;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const trimmed = values.name.trim();
    const original = name.trim();

    if (trimmed === original) {
      setIsEdit(null); // just close edit mode
      return;
    }

    updateName.mutate({ id, name: trimmed });
    // updateName.mutate({ ...values, id: id });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRef}
                    onBlur={() => {
                      const value = form.getValues("name").trim();
                      if (!value) {
                        form.setValue("name", "Untitled");
                        onSubmit({ id, name: "Untitled" });
                      } else {
                        onSubmit({ id, name: value });
                      }
                    }}
                  />
                </FormControl>
                {isPending && (
                  <Loader2 className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
