// Study: Define the ConflictError class used by the HTTP error-handling flow.
// Study: Bring in `{ AppError }` from `"./AppError"` so this file can use it.
import { AppError } from "./AppError";

// Study: Define `ConflictError` with `extends AppError`.
export class ConflictError extends AppError {
    // Study: Initialize a new instance of `ConflictError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 409);
    // Study: End this group of steps.
    }
// Study: Close the class declaration.
}