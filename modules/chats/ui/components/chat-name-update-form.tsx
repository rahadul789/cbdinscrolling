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

interface ChatNameUpdateProps {
  id: string;
  title: string;
  setIsEdit: (value: string | null) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const ChatNameUpdateForm = ({
  id,
  title,
  setIsEdit,
}: ChatNameUpdateProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title ?? "Untitled",
    },
  });

  const utils = trpc.useUtils();
  const updateTitle = trpc.chats.update.useMutation({
    onSuccess: ({ title }) => {
      utils.chats.getChats.invalidate();
      utils.projects.getProjectChats.invalidate();
      toast(`${title}  updated successfully`);
      setIsEdit(null);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const isPending = updateTitle.isPending;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const trimmed = values.title.trim();
    const original = title.trim();

    if (trimmed === original) {
      setIsEdit(null); // just close edit mode
      return;
    }

    updateTitle.mutate({ id, title: trimmed });
    // updateTitle.mutate({ ...values, id: id });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRef}
                    onBlur={() => {
                      const value = form.getValues("title").trim();
                      if (!value) {
                        form.setValue("title", "Untitled");
                        onSubmit({ title: "Untitled" });
                      } else {
                        onSubmit({ title: value });
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
