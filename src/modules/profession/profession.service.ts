// Study: Apply business rules and coordinate database operations for the worker profession catalog.
// Study: Import `* as professionRepository` from `"./profession.repository"`.
import * as professionRepository from "./profession.repository";

// Study: Export `getProfessions` as an async function that returns a promise.
export const getProfessions = async () => {
    // Study: Return `await professionRepository.getProfessions()` to the caller.
    return await professionRepository.getProfessions();
// Study: Close the code block.
};
