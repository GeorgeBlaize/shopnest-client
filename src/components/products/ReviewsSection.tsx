'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { StarRating } from '@/components/shared/StarRating';
import { FormField } from '@/components/ui/FormField';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { api, ApiClientError } from '@/lib/apiClient';
import { formatDate } from '@/lib/utils';
import { reviewSchema, type ReviewInput } from '@/lib/validators';
import type { Review } from '@/types';

export function ReviewsSection({ productId, reviews, onReviewAdded }: { productId: string; reviews: Review[]; onReviewAdded: (review: Review) => void }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, comment: '' } });

  async function onSubmit(values: ReviewInput) {
    setServerError('');
    try {
      const data = await api.post<{ review: Review }>('/reviews', { productId, ...values });
      onReviewAdded(data.review);
      toast.success('Review submitted, thank you!');
      setSubmitted(true);
      reset({ rating: 0, comment: '' });
      setRating(0);
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Could not submit review');
    }
  }

  const alreadyReviewed = user && reviews.some((r) => r.userId === user.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews yet. Be the first to share your experience.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-surface-border pb-6 last:border-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{review.user.name}</p>
                <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
              </div>
              <StarRating value={review.rating} size={14} className="mt-1" />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <div className="rounded-xl border border-surface-border p-5">
          <h3 className="font-semibold">Write a review</h3>
          {!user ? (
            <p className="mt-3 text-sm text-slate-500">
              <Link href="/login" className="font-medium text-brand hover:underline">
                Log in
              </Link>{' '}
              to leave a review.
            </p>
          ) : alreadyReviewed || submitted ? (
            <p className="mt-3 text-sm text-slate-500">You have already reviewed this product. Thank you!</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-3 space-y-4">
              <FormField id="rating" label="Your rating" required error={errors.rating?.message}>
                <StarRating
                  value={rating}
                  interactive
                  onChange={(v) => {
                    setRating(v);
                    setValue('rating', v, { shouldValidate: true });
                  }}
                />
              </FormField>
              <FormField id="comment" label="Your review" required error={errors.comment?.message}>
                <Textarea id="comment" hasError={!!errors.comment} {...register('comment')} />
              </FormField>
              {serverError && <p className="text-sm text-red-600">{serverError}</p>}
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Submit review
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
