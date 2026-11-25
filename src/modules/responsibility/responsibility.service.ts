// Study: This file is about the list of duties that can be assigned to a contractor. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as responsibilityRepository` from `"./responsibility.repository"` so this file can use it.
import * as responsibilityRepository from "./responsibility.repository";

// Study: Make `getResponsibilities` available to other files. Its result arrives after its work finishes.
export const getResponsibilities = async () => {
    // Study: Give `await responsibilityRepository.getActiveResponsibilities()` back to the code that asked for it.
    return await responsibilityRepository.getActiveResponsibilities();
// Study: End this group of steps.
};
