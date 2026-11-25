// Study: Define the NotFoundError class used by the HTTP error-handling flow.
// Study: Import `{ AppError }` from `"./AppError"`.
import { AppError } from "./AppError";

// Study: Define `NotFoundError` with `extends AppError`.
export class NotFoundError extends AppError {
    // Study: Initialize a new instance of `NotFoundError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 404);
    // Study: Close the code block.
    }
// Study: Close the class declaration.
}

//used for - user not found
//company not found
//project not found