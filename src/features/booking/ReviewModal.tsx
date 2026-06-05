'use client';

/**
 * Modal đánh giá HLV sau buổi tập hoàn thành (Tuần 7).
 * 1-5 sao + comment + tags. Double-blind 7 ngày (UI hint).
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import AppIcon from '@components/ui/AppIcon';
import { reviewService } from '@services/review.service';
import { useToast } from '@contexts/ToastContext';
import { cn } from '@lib/cn';
import { REVIEW_TAGS } from '@app-types/review';
import type { Booking } from '@app-types/booking';

const RATING_LABEL = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

export default function ReviewModal({
  booking,
  onClose,
  onSubmitted,
}: {
  booking: Booking;
  onClose: () => void;
  onSubmitted: (bookingId: string) => void;
}) {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function toggleTag(t: string) {
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  async function submit() {
    if (rating === 0 || busy) return;
    setBusy(true);
    try {
      await reviewService.create({
        coachId: booking.coachId,
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
        tags,
      });
      toast.success('Cảm ơn bạn đã đánh giá! Đánh giá sẽ công khai sau 7 ngày.');
      onSubmitted(booking.id);
    } catch {
      toast.error('Không gửi được đánh giá, vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }

  const shown = hover || rating;

  const modal = (
    <div className="review-modal" role="dialog" aria-modal="true" aria-label="Đánh giá buổi tập">
      <div className="review-modal__backdrop" onClick={onClose} />
      <div className="review-modal__box">
        <button type="button" className="review-modal__close" aria-label="Đóng" onClick={onClose}>
          <AppIcon name="close" size={20} />
        </button>

        <h3 className="review-modal__title">Đánh giá buổi tập</h3>
        <p className="review-modal__sub">Với <strong>{booking.coachName}</strong></p>

        {/* Stars */}
        <div className="review-stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={cn('review-stars__btn', s <= shown && 'is-on')}
              onMouseEnter={() => setHover(s)}
              onClick={() => setRating(s)}
              aria-label={`${s} sao`}
            >
              <AppIcon name="star" size={32} variant={s <= shown ? 'Bold' : 'Linear'} />
            </button>
          ))}
        </div>
        <p className="review-stars__label">{shown ? RATING_LABEL[shown] : 'Chạm để chọn số sao'}</p>

        {/* Tags */}
        <div className="review-tags">
          {REVIEW_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              className={cn('review-tags__chip', tags.includes(t) && 'is-on')}
              onClick={() => toggleTag(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          className="review-modal__textarea"
          placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)…"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
        />

        <p className="review-modal__hint">
          <AppIcon name="lock" size={13} /> Đánh giá ẩn danh 2 chiều — công khai sau 7 ngày hoặc khi cả hai bên cùng đánh giá.
        </p>

        <div className="review-modal__actions">
          <button type="button" className="review-modal__cancel" onClick={onClose}>Để sau</button>
          <button type="button" className="review-modal__submit" disabled={rating === 0 || busy} onClick={submit}>
            {busy ? 'Đang gửi…' : 'Gửi đánh giá'}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
