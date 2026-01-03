"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MessageSquare,
  Send,
  Trash2,
  Reply,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { addComment, deleteComment } from "@/lib/actions/commentActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Profile {
  full_name: string;
  avatar_url: string;
}

interface Comment {
  id: string;
  plan_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles: Profile;
}

interface CommentSectionProps {
  planId: string;
  initialComments: any[];
  currentUserId: string | null;
}

export function CommentSection({
  planId,
  initialComments,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = async (parentId?: string) => {
    const content = parentId
      ? (document.getElementById(`reply-${parentId}`) as HTMLInputElement)
          ?.value
      : newComment;
    if (!content?.trim()) return;

    setIsSubmitting(true);
    const res = await addComment(planId, content, parentId);
    if (res.success && res.comment) {
      setComments([...comments, res.comment as unknown as Comment]);
      if (parentId) {
        setReplyTo(null);
      } else {
        setNewComment("");
      }
      toast.success("Comment posted");
    } else {
      toast.error(res.error || "Failed to post comment");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;

    const res = await deleteComment(commentId, planId);
    if (res.success) {
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const rootComments = comments.filter((c) => !vaildateParent(c, comments));
  // Simple check for parent existence in current list
  function vaildateParent(c: Comment, all: Comment[]) {
    return c.parent_id && all.some((a) => a.id === c.parent_id);
  }

  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white font-semibold">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        Comments ({comments.length})
      </div>

      {/* Main Input */}
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
          <UserIcon className="h-5 w-5 text-neutral-500" />
        </div>
        <div className="flex-1 flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-blue-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Nested Comments List */}
      <div className="space-y-4">
        {comments
          .filter((c) => !c.parent_id)
          .map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onReply={() => setReplyTo(comment.id)}
              />

              {/* Replies */}
              <div className="ml-12 space-y-4 border-l border-neutral-800 pl-4">
                {getReplies(comment.id).map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    currentUserId={currentUserId}
                    onDelete={handleDelete}
                    isReply
                  />
                ))}

                {/* Reply Input */}
                {replyTo === comment.id && (
                  <div className="flex gap-2">
                    <Input
                      id={`reply-${comment.id}`}
                      placeholder="Write a reply..."
                      className="h-9 bg-neutral-900 border-neutral-800 text-sm text-white"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSubmit(comment.id)}
                      className="bg-blue-600 h-9"
                    >
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyTo(null)}
                      className="h-9 text-neutral-500 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {comments.length === 0 && (
          <p className="text-sm text-neutral-500 text-center py-4 italic font-light">
            No comments yet. Start the conversation!
          </p>
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  onReply?: () => void;
  isReply?: boolean;
}) {
  const isOwner = currentUserId === comment.user_id;

  return (
    <div className="group flex gap-3">
      <div
        className={cn(
          "shrink-0 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700",
          isReply ? "h-8 w-8" : "h-10 w-10",
        )}
      >
        <UserIcon
          className={cn("text-neutral-500", isReply ? "h-4 w-4" : "h-5 w-5")}
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {comment.profiles.full_name || "Unknown User"}
            </span>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-tighter cursor-default">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onReply && (
              <button
                onClick={onReply}
                className="p-1.5 text-neutral-500 hover:text-blue-500 hover:bg-neutral-800 rounded-md transition-colors"
                title="Reply"
              >
                <Reply className="h-3.5 w-3.5" />
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-neutral-800 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed font-light">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
