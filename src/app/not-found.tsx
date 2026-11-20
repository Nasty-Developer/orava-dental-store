import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 display text-display-lg text-ink">This page has been extracted.</h1>
      <p className="mt-4 max-w-[380px] text-[14px] leading-relaxed text-ink-mute">
        The link may be old, or the product may have left the shelf. The shop is still here.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-primary">
          Browse the shop
          <IconArrowRight size={16} />
        </Link>
        <Link href="/" className="btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
