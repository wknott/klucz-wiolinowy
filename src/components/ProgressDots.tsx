import { cn } from '@/lib/utils';

export type ProgressDotsProps = {
  progress: number;
  total: number;
  className?: string;
};

export function ProgressDots({ progress, total, className }: ProgressDotsProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${String(progress)} z ${String(total)} nut zaliczonych`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'size-3 rounded-full border transition-colors',
            i < progress ? 'border-green-600 bg-green-500' : 'border-border bg-muted',
          )}
        />
      ))}
    </div>
  );
}
