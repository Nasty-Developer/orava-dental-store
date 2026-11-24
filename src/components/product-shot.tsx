import type { ProductImage, ProductVisual } from "@/data/products";
import { ProductArt } from "./product-art";

/**
 * The product visual, in one place.
 *
 * A catalogue entry shows its real photograph when it has one, otherwise the
 * placeholder illustration. Photographs are drawn object-contain on white so a
 * square studio shot is never cropped by the 4:5 card frame, and the
 * illustration keeps the category tint behind it.
 */
export function ProductShot({
  image,
  visual,
  title,
  className = "",
  artClassName = "",
  sizes,
  priority = false,
}: {
  image: ProductImage | null;
  visual: ProductVisual;
  title: string;
  className?: string;
  artClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt ?? title}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full bg-white object-contain ${className}`}
      />
    );
  }

  // No photograph cleared for publication yet. Show a deliberate, category-shaped
  // plate instead of a blank frame, and label it so nobody mistakes it for a
  // product photo. Each clinical area keeps its own motif via `visual`.
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_32%,#F4F9FC_0%,#E9F1F6_58%,#DEE9F0_100%)] ${className}`}
    >
      <ProductArt
        visual={visual}
        title={title}
        className={artClassName || "h-[72%] w-[72%]"}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-[5%] text-center text-[8.5px] font-medium uppercase tracking-[0.16em] text-clinic-700/55">
        Photo pending
      </span>
    </div>
  );
}
