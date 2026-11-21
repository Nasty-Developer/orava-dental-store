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

  return <ProductArt visual={visual} title={title} className={artClassName || className} />;
}
