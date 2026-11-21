// Barrel file for the SOMIL catalogue. One array per clinical area.

import { restorative } from "./restorative";
import { endodontics } from "./endodontics";
import { prosthodontics } from "./prosthodontics";
import { impression } from "./impression";
import { instruments } from "./instruments";
import { burs } from "./burs";
import { handpieces } from "./handpieces";
import { orthodontics } from "./orthodontics";
import { implantology } from "./implantology";
import { oralSurgery } from "./oralSurgery";
import { periodontics } from "./periodontics";
import { pedodontics } from "./pedodontics";
import { laboratory } from "./laboratory";
import { consumables } from "./consumables";
import { infectionControl } from "./infectionControl";
import { sterilization } from "./sterilization";
import { equipment } from "./equipment";
import { imaging } from "./imaging";
import { preventive } from "./preventive";
import { whitening } from "./whitening";
import { digital } from "./digital";
import { anaesthetics } from "./anaesthetics";
import { clinicKits } from "./clinicKits";

export const catalogue = [
  ...restorative,
  ...endodontics,
  ...prosthodontics,
  ...impression,
  ...instruments,
  ...burs,
  ...handpieces,
  ...orthodontics,
  ...implantology,
  ...oralSurgery,
  ...periodontics,
  ...pedodontics,
  ...laboratory,
  ...consumables,
  ...infectionControl,
  ...sterilization,
  ...equipment,
  ...imaging,
  ...preventive,
  ...whitening,
  ...digital,
  ...anaesthetics,
  ...clinicKits,
];
