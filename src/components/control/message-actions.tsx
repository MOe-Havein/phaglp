"use client";

import { useState } from "react";
import { markMessageAsRead, deleteContactMessage } from "@/lib/contact-actions";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MessageActionsProps {
  id: string;
  isRead: boolean;
}

export function MessageActions({ id, isRead }: MessageActionsProps) {
  const [loading, setLoading] = useState<"read" | "delete" | null>(null);
  const router = useRouter();

  const handleToggleRead = async () => {
    setLoading("read");
    try {
      const result = await markMessageAsRead(id, !isRead);
      if (result.success) {
        toast.success(isRead ? "Marked as unread" : "Marked as read");
        router.refresh();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setLoading("delete");
    try {
      const result = await deleteContactMessage(id);
      if (result.success) {
        toast.success("Message deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleRead}
        disabled={!!loading}
        title={isRead ? "Mark as unread" : "Mark as read"}
      >
        {loading === "read" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isRead ? (
          <Circle className="w-4 h-4" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={!!loading}
        className="text-destructive hover:bg-destructive/10"
        title="Delete message"
      >
        {loading === "delete" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}
