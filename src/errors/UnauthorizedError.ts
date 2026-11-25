// Study: Define the UnauthorizedError class used by the HTTP error-handling flow.
// Study: Import `{ AppError }` from `"./AppError"`.
import { AppError } from "./AppError";

// Study: Define `UnauthorizedError` with `extends AppError`.
export class UnauthorizedError extends AppError {
    // Study: Initialize a new instance of `UnauthorizedError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 401);
    // Study: Close the code block.
    }
// Study: Close the class declaration.
}

//used for - wrong password
//invalid JWT
//missing token