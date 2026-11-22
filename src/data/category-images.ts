import { PRODUCT_PHOTOS_LIVE } from "@/data/image-rights";

/**
 * Category card photography.
 *
 * One genuine product photograph per clinical area, used on the homepage tiles
 * and the categories index. Every file here already exists in public/products/
 * and is recorded in docs/PRODUCT-IMAGE-REGISTER.csv with its source and
 * permission state, so this file introduces no new or unlicensed asset.
 *
 * To change a card, point `src` at another file in public/products/ and update
 * `alt`. To fall back to the drawn illustration for one area, delete its entry.
 */

export type CategoryShot = { src: string; alt: string };

const categoryShotRaw: Record<string, CategoryShot> = {
  anaesthetics: { src: "/products/d-cult-benz-o-topical-anesthetic-gel.webp", alt: "Benz O Topical Anesthetic Gel" },
  burs: { src: "/products/ss-white-round-finishing-bur-12-blades-7008-pack-of-10.webp", alt: "SS White Round Finishing Bur-12 Blades #7008 (Pack Of 10)" },
  "clinic-kits": { src: "/products/oracraft-offer-package-premium-with-trolly-bag-opp.webp", alt: "Offer Package Premium With Trolly Bag - OPP" },
  consumables: { src: "/products/gdc-cotton-holder-accessories-ach.webp", alt: "Cotton Holder Accessories (ACH)" },
  digital: { src: "/products/denfac-zirconia-ceramic-blank-st-white-shade-cad-cam-disc.webp", alt: "Zirconia Ceramic Blank ST | White Shade | CAD/CAM Disc" },
  endodontics: { src: "/products/neoendo-gutta-percha-points-4-length-marked.webp", alt: "Gutta Percha Points 4% (Length Marked)" },
  equipment: { src: "/products/waldent-ultrawave-maxpiezo-4-led-ultrasonic-scaler.webp", alt: "Ultrawave MaxPiezo 4 LED Ultrasonic Scaler" },
  handpieces: { src: "/products/waldent-surgical-saw-handpiece-reciprocating-up-and-down.webp", alt: "Surgical Saw Handpiece - Reciprocating (Up & Down Cutting Motion) | DGZ-R" },
  imaging: { src: "/products/kodak-carestream-x-ray-film-e-speed-pack-of-150.webp", alt: "Kodak Carestream X Ray Film E Speed (Pack of 150)" },
  implantology: { src: "/products/dentalplant-implant-stability-tester-golden.webp", alt: "Implant Stability Tester - Golden" },
  impression: { src: "/products/prime-dental-bite-registration-putty.webp", alt: "Prime Dental Bite Registration Putty" },
  "infection-control": { src: "/products/xcem-hexpron-water-line-disinfectant-hex200.webp", alt: "Hexpron Water Line Disinfectant - HEX200" },
  instruments: { src: "/products/superendo-maxvision-rhodium-coated-anti-fog-mouth-mirror-pack.webp", alt: "MaxVision Rhodium-Coated Anti-Fog Mouth Mirror (Pack of 10)" },
  laboratory: { src: "/products/kalabhai-kalstone-green-3kg.webp", alt: "Kalstone (Green) - 3Kg" },
  "oral-surgery": { src: "/products/woodpecker-ultra-surgery-x.webp", alt: "Ultra Surgery X" },
  orthodontics: { src: "/products/orthometric-elastomerics-modular-ligatures.webp", alt: "Elastomerics Modular Ligatures" },
  pedodontics: { src: "/products/pedo-crown-permanent-1st-molar-kits.webp", alt: "Permanent 1st Molar Kits" },
  periodontics: { src: "/products/gc-coe-pak-periodontal-dressing-standard-pkg-new-pack.webp", alt: "Coe Pak Periodontal Dressing Standard Pkg (New Pack)" },
  preventive: { src: "/products/sandika-pharma-pyx-proxy-floss-pack-of-10.webp", alt: "Pyx Proxy Floss (Pack of 10)" },
  prosthodontics: { src: "/products/hn-dental-crown-o-assist.webp", alt: "Crown - O - Assist" },
  restorative: { src: "/products/waldent-nanofill-zirconium-composite-kit.webp", alt: "NanoFill Zirconium Composite Kit" },
  sterilization: { src: "/products/shivaah-autoclave-indicator-tape.webp", alt: "Autoclave Indicator Tape" },
  whitening: { src: "/products/healix-inoffice-bleaching-machine.webp", alt: "Inoffice Bleaching Machine" },
};

export const categoryShot: Record<string, CategoryShot> = PRODUCT_PHOTOS_LIVE
  ? categoryShotRaw
  : {};
