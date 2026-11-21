import type { CategorySlug, ProductVisual } from "./types";

export type { CategorySlug };

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  blurb: string;
  description: string;
  /** motif used on the category tile */
  visual: ProductVisual;
  order: number;
};

export const categories: Category[] = [
  {
    slug: "restorative",
    name: "Restorative Dentistry",
    shortName: "Restorative",
    blurb: "Composites, adhesives and cements.",
    description:
      "Direct restorative systems for everyday operative work: universal and flowable composites, bonding agents, etchants, liners and the cements that sit under them. Filter by brand to keep a single system on the shelf.",
    visual: "syringe",
    order: 1,
  },
  {
    slug: "endodontics",
    name: "Endodontics",
    shortName: "Endodontics",
    blurb: "Access, shaping, irrigation, obturation.",
    description:
      "Everything for root canal treatment in one place, from access burs and rotary file systems through irrigation solutions and intracanal medicaments to gutta-percha, sealers and obturation devices.",
    visual: "file",
    order: 2,
  },
  {
    slug: "prosthodontics",
    name: "Prosthodontics",
    shortName: "Prosthodontics",
    blurb: "Crowns, dentures, posts and cores.",
    description:
      "Fixed and removable prosthodontic materials: denture base resins, teeth sets, post and core systems, crown preparation kits and the relining and repair materials that keep a prosthesis in service.",
    visual: "crown",
    order: 3,
  },
  {
    slug: "impression",
    name: "Impression Materials",
    shortName: "Impressions",
    blurb: "Alginates, silicones, putties.",
    description:
      "Alginate, addition and condensation silicones, bite registration pastes and the trays and adhesives around them. Choose by working time and detail reproduction for the case in front of you.",
    visual: "impression",
    order: 4,
  },
  {
    slug: "instruments",
    name: "Dental Instruments",
    shortName: "Instruments",
    blurb: "Hand instruments and diagnostics.",
    description:
      "Hand instruments for examination, restoration, surgery and hygiene: mirrors, probes, explorers, excavators, carvers, forceps, elevators, scissors and needle holders.",
    visual: "instrument",
    order: 5,
  },
  {
    slug: "burs",
    name: "Dental Burs",
    shortName: "Burs",
    blurb: "Diamond, carbide, finishing.",
    description:
      "Diamond and carbide burs for cavity preparation, crown reduction and finishing, plus discs, stones and polishing points. Available in friction grip and latch type where listed.",
    visual: "bur",
    order: 6,
  },
  {
    slug: "handpieces",
    name: "Handpieces",
    shortName: "Handpieces",
    blurb: "Air rotors, contra-angles, motors.",
    description:
      "Air rotors, contra-angle and straight handpieces, micromotors and endodontic motors, with the cartridges and couplings needed to keep them running.",
    visual: "handpiece",
    order: 7,
  },
  {
    slug: "orthodontics",
    name: "Orthodontics",
    shortName: "Orthodontics",
    blurb: "Brackets, wires, elastomerics.",
    description:
      "Bracket systems in metal, ceramic and self-ligating formats, archwires from NiTi to stainless steel, elastomeric modules, chains, ligature ties and the pliers and accessories that go with them.",
    visual: "bracket",
    order: 8,
  },
  {
    slug: "implantology",
    name: "Implantology",
    shortName: "Implantology",
    blurb: "Implants, abutments, grafts.",
    description:
      "Implant systems, abutments and healing components alongside bone grafts, membranes and the surgical kits and drills used to place them.",
    visual: "implant",
    order: 9,
  },
  {
    slug: "oral-surgery",
    name: "Oral Surgery",
    shortName: "Oral Surgery",
    blurb: "Extraction, sutures, haemostasis.",
    description:
      "Extraction forceps and elevators, surgical and suturing supplies, haemostats, retractors and the dressings and mouth gags that make a surgical appointment run smoothly.",
    visual: "suture",
    order: 10,
  },
  {
    slug: "periodontics",
    name: "Periodontics",
    shortName: "Periodontics",
    blurb: "Scaling, curettage, regeneration.",
    description:
      "Hand and ultrasonic scaling, curettes, periodontal probes, splints, membranes and dressings for the management of periodontal disease and regeneration.",
    visual: "implant",
    order: 11,
  },
  {
    slug: "pedodontics",
    name: "Pedodontics",
    shortName: "Pedodontics",
    blurb: "Paediatric crowns and materials.",
    description:
      "Stainless steel and strip crowns, pit and fissure sealants, caries detectors and the child-sized instruments that make a first visit go well.",
    visual: "crown",
    order: 12,
  },
  {
    slug: "laboratory",
    name: "Dental Laboratory",
    shortName: "Laboratory",
    blurb: "Stones, waxes, model work.",
    description:
      "Die stones and plasters, modelling and casting waxes, duplicating and model work, articulating supplies and the bench consumables a prosthetics lab runs through.",
    visual: "box",
    order: 13,
  },
  {
    slug: "consumables",
    name: "Dental Consumables",
    shortName: "Consumables",
    blurb: "The things that run out.",
    description:
      "Saliva ejectors, applicator tips, cotton rolls, mixing bowls and spatulas, wedges, matrix bands and the rest of the everyday items a chair consumes by the box.",
    visual: "box",
    order: 14,
  },
  {
    slug: "infection-control",
    name: "Infection Control",
    shortName: "Infection Control",
    blurb: "Disinfection and protection.",
    description:
      "Surface disinfectants, hand hygiene, wipes, gloves, masks, gowns and eyewear, organised so a clinic can restock a whole infection control protocol in one order.",
    visual: "ppe",
    order: 15,
  },
  {
    slug: "sterilization",
    name: "Sterilization",
    shortName: "Sterilization",
    blurb: "Autoclaves, pouches, indicators.",
    description:
      "Class B and N autoclaves, ultrasonic cleaners, sterilization pouches and rolls, cassettes, chemical and biological indicators and the accessories that keep a cycle valid.",
    visual: "machine",
    order: 16,
  },
  {
    slug: "equipment",
    name: "Dental Equipment",
    shortName: "Equipment",
    blurb: "Chairs, compressors, scalers.",
    description:
      "Operatory equipment: dental chairs and units, air compressors, ultrasonic scalers, curing lights, suction and the spares and accessories that support them.",
    visual: "machine",
    order: 17,
  },
  {
    slug: "imaging",
    name: "Dental Imaging",
    shortName: "Imaging",
    blurb: "X-ray, sensors, films.",
    description:
      "Intraoral X-ray units and sensors, films and films holders, processing chemistry, viewers and the protective aprons and barriers that go with taking a radiograph.",
    visual: "machine",
    order: 18,
  },
  {
    slug: "preventive",
    name: "Preventive Dentistry",
    shortName: "Preventive",
    blurb: "Fluoride, sealants, hygiene.",
    description:
      "Fluoride varnishes and gels, sealants, prophylaxis pastes, desensitisers and the toothbrushes, floss and mouthwashes a practice recommends or retails to patients.",
    visual: "tube",
    order: 19,
  },
  {
    slug: "whitening",
    name: "Whitening",
    shortName: "Whitening",
    blurb: "In-office and at-home bleaching.",
    description:
      "Bleaching gels for in-office and at-home use, tray systems, whitening lights and the polishing pastes and desensitisers that complete a whitening protocol.",
    visual: "tube",
    order: 20,
  },
  {
    slug: "digital",
    name: "Digital Dentistry",
    shortName: "Digital",
    blurb: "Scanners, CAD/CAM, 3D printing.",
    description:
      "Intraoral scanners, milling and printing materials, zirconia and ceramic blanks, and the resins and tools that make a digital workflow possible in a practice or a lab.",
    visual: "machine",
    order: 21,
  },
  {
    slug: "anaesthetics",
    name: "Anaesthetic Supplies",
    shortName: "Anaesthetics",
    blurb: "Cartridges, syringes, needles.",
    description:
      "Local anaesthetic cartridges, aspirating syringes, needles in the lengths and gauges used for infiltration and block techniques, and topical anaesthetics.",
    visual: "carpule",
    order: 22,
  },
  {
    slug: "clinic-kits",
    name: "Clinic Setup Kits",
    shortName: "Clinic Kits",
    blurb: "Bundled kits for a new chair.",
    description:
      "Bundled kits that cover a whole procedure or a whole chair: rubber dam kits, instrument kits, PPE kits and the starter sets a new clinic or a student needs in one order.",
    visual: "box",
    order: 23,
  },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  Category
>;

export const categorySlugs = categories.map((c) => c.slug);

export const getCategory = (slug: string) => categoryMap[slug as CategorySlug];
