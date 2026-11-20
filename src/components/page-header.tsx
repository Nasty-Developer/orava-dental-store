import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-ink-faint">
      <Link href="/" className="transition-colors hover:text-ink">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className="text-line-strong">/</span>
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-mute">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  aside,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  crumbs?: { label: string; href?: string }[];
  aside?: ReactNode;
}) {
  return (
    <header className="shell border-b border-line pb-10 pt-8 md:pb-14 md:pt-12">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="mt-7 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-[720px]">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 display text-display-lg text-ink">{title}</h1>
          {lede && <p className="lede mt-5 max-w-[560px]">{lede}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </header>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[680px] space-y-6 text-[14.5px] leading-[1.75] text-ink-mute [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:leading-tight [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:text-ink [&_a]:text-clinic-700 [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
      {children}
    </div>
  );
}
