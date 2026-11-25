// Study: Define the UnauthorizedError class used by the HTTP error-handling flow.
// Study: Bring in `{ AppError }` from `"./AppError"` so this file can use it.
import { AppError } from "./AppError";

// Study: Define `UnauthorizedError` with `extends AppError`.
export class UnauthorizedError extends AppError {
    // Study: Initialize a new instance of `UnauthorizedError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 401);
    // Study: End this group of steps.
    }
// Study: Close the class declaration.
}

//used for - wrong password
//invalid JWT
//missing token