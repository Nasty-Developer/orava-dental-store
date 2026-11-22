# Product image direction

The visual reference for how SOMIL presents products is
`docs/design/somil-concept-light-cure-composite.png`, supplied by the owner on
2026-11-22. It is a **studio render of a SOMIL-branded light-cure composite kit**,
not a photograph of a real product, and it is stored outside `public/` so it can
never be served or picked up as a listing image.

## What we take from it

- **A seamless white field.** No tinted panel, no border, no drop shadow behind
  the product. Photographs are drawn `object-contain` on `#FFFFFF` so a square
  studio shot never gets cropped by a taller card frame.
- **Generous, consistent margins.** The product sits inside the frame rather than
  touching its edges. The shop card uses a percentage margin (`p-[7%]`) so the
  optical size of a product stays the same at every breakpoint.
- **Blue and white, nothing else.** The single accent stays `#0C6E8F`; product
  photography carries the colour, the interface stays quiet.
- **A consistent camera position.** Pack shots are straight-on, centred, evenly
  lit. No lifestyle scenes, no hands, no clinic backgrounds.
- **Kit composition.** Where a product is a kit, the open box, the trays, the
  loose units and the instructions sit together in one frame.

## What we do not take

- **SOMIL packaging on a third-party product.** The composite kit in the render
  carries SOMIL branding. It must not be attached to any product SOMIL does not
  manufacture or private-label, because that would misrepresent who made it.
- **Rendered packaging as a listing photograph.** Even for an authorised private
  label, the listing needs a real photograph of the real pack. A render is a
  design target, never evidence of a product that exists.
- **Removal of manufacturer marks.** Real packaging keeps its legally required
  labels and manufacturer identification.

## Authorisation rule

A SOMIL pack shot may only be used on a product that is genuinely authorised for
SOMIL private labelling. That is recorded in the catalogue, not assumed:

```ts
{
  slug: "…",
  privateLabelAuthorised: true,
  privateLabelRef: "Manufacturer agreement, signed 2026-12-01",
  image: { src: "/products/somil-….webp", source: "…", license: "…", permission: "granted" },
}
```

`npm run images:check` fails the build when a product uses a `/products/somil-…`
image without `privateLabelAuthorised`, or sets the flag without recording who
authorised it. The check reports how many products are authorised private label.

**Current state: 0 of 344 products are authorised.** Every listing therefore keeps
its genuine manufacturer photograph and identification, and this render remains a
design reference only.
