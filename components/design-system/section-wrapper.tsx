import { cn } from '@/lib/utils';

export function SectionWrapper({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn('space-y-6 border-t border-border pt-12', className)}
    >
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
        — {title}
      </h2>
      {children}
    </section>
  );
}
