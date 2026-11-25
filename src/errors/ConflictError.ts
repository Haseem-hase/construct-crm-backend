// Study: Define the ConflictError class used by the HTTP error-handling flow.
// Study: Import `{ AppError }` from `"./AppError"`.
import { AppError } from "./AppError";

// Study: Define `ConflictError` with `extends AppError`.
export class ConflictError extends AppError {
    // Study: Initialize a new instance of `ConflictError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 409);
    // Study: Close the code block.
    }
// Study: Close the class declaration.
}