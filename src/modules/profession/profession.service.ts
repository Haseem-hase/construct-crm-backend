// Study: This file is about the list of trades workers can be recorded under. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as professionRepository` from `"./profession.repository"` so this file can use it.
import * as professionRepository from "./profession.repository";

// Study: Make `getProfessions` available to other files. Its result arrives after its work finishes.
export const getProfessions = async () => {
    // Study: Give `await professionRepository.getProfessions()` back to the code that asked for it.
    return await professionRepository.getProfessions();
// Study: End this group of steps.
};
