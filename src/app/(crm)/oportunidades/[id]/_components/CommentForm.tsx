"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useComment } from "@/hooks/opportunities/useOpportunityAction";
import { applyValidationErrors, getErrorMessage } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import type { CommentFormProps } from "../_types/detail";

const commentSchema = z.object({
  body: z.string().trim().min(1, "Escreva um comentário").max(2000, "Use até 2.000 caracteres"),
});

type CommentData = z.infer<typeof commentSchema>;

export const CommentForm = ({ opportunityId }: CommentFormProps) => {
  const addComment = useComment(opportunityId);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CommentData>({ resolver: zodResolver(commentSchema), defaultValues: { body: "" } });

  const body = useWatch({ control, name: "body" });
  const isEmpty = body.trim() === "";

  const onSubmit = async (data: CommentData) => {
    try {
      await addComment.mutateAsync(data);
      reset();
    } catch (error) {
      if (!applyValidationErrors(error, setError)) setError("root", { message: getErrorMessage(error) });
    }
  };

  const renderError = () => {
    const message = errors.body?.message ?? errors.root?.message;
    return (
      message && (
        <p id="comment-error" role="alert" className="text-sm text-error-fg">
          {message}
        </p>
      )
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 px-4 py-3">
      <label htmlFor="comment-body" className="sr-only">
        Comentário
      </label>
      <textarea
        id="comment-body"
        rows={3}
        placeholder="Escreva um comentário…"
        aria-invalid={errors.body ? "true" : undefined}
        aria-describedby={errors.body || errors.root ? "comment-error" : undefined}
        className="min-h-16 w-full resize-y rounded-md border border-border-strong bg-surface px-2.5 py-2 text-base text-ink placeholder:text-ink-soft md:text-sm"
        {...register("body")}
      />
      {renderError()}
      <button type="submit" disabled={isEmpty || isSubmitting} className={`${BUTTON_STYLES.primary} self-end`}>
        Comentar
      </button>
    </form>
  );
};
