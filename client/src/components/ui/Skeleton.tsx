export function Skeleton({ className = '', width, height }: { className?: string; width?: string; height?: string }) {
  return <div className={['skeleton rounded-[2px]', className].join(' ')} style={{ width, height }} />;
}

export function ScriptCardSkeleton() {
  return (
    <div className="border border-[var(--border)] rounded-[2px] p-5 flex flex-col gap-3 bg-[var(--surface)]">
      <div className="flex items-center gap-2">
        <Skeleton width="48px" height="18px" />
        <Skeleton width="80px" height="18px" />
      </div>
      <Skeleton height="28px" width="75%" />
      <Skeleton height="16px" width="90%" />
      <Skeleton height="16px" width="60%" />
      <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)]">
        <Skeleton width="30px" height="14px" />
        <Skeleton width="30px" height="14px" />
        <Skeleton width="30px" height="14px" />
      </div>
    </div>
  );
}
