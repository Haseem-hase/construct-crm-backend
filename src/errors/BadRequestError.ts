// Study: Define the BadRequestError class used by the HTTP error-handling flow.
// Study: Bring in `{ AppError }` from `"./AppError"` so this file can use it.
import { AppError } from "./AppError";

// Study: Define `BadRequestError` with `extends AppError`.
export class BadRequestError extends AppError {
    // Study: Initialize a new instance of `BadRequestError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 400);
    // Study: End this group of steps.
    }
// Study: Close the class declaration.
}

//used fo invalid request
//invalid input
//validation failure (when not handled by zod)