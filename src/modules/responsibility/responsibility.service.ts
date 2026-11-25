// Study: Apply business rules and coordinate database operations for the contractor responsibility catalog.
// Study: Import `* as responsibilityRepository` from `"./responsibility.repository"`.
import * as responsibilityRepository from "./responsibility.repository";

// Study: Export `getResponsibilities` as an async function that returns a promise.
export const getResponsibilities = async () => {
    // Study: Return `await responsibilityRepository.getActiveResponsibilities()` to the caller.
    return await responsibilityRepository.getActiveResponsibilities();
// Study: Close the code block.
};
