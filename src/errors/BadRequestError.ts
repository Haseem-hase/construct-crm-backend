// Study: Define the BadRequestError class used by the HTTP error-handling flow.
// Study: Import `{ AppError }` from `"./AppError"`.
import { AppError } from "./AppError";

// Study: Define `BadRequestError` with `extends AppError`.
export class BadRequestError extends AppError {
    // Study: Initialize a new instance of `BadRequestError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 400);
    // Study: Close the code block.
    }
// Study: Close the class declaration.
}

//used fo invalid request
//invalid input
//validation failure (when not handled by zod)